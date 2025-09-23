import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, Alert, Image 
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { setPunchInTime, setPunchOutTime } from '../redux/permissionsSlice';
import { requestPermissions } from '../base/permissions';
import api from '../api/api';

const PunchInScreen = ({ navigation, route }) => {
  const { type } = route.params; // 'punch_in' or 'punch_out'
  const dispatch = useDispatch();
  const { access } = useSelector(state => state.auth);

  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    startPunchFlow();
  }, []);

  const startPunchFlow = async () => {
    // 1️⃣ Request permissions
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      navigation.goBack();
      return;
    }

    // 2️⃣ Open Camera
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
      if (response.didCancel) {
        navigation.goBack();
      } else if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage);
        navigation.goBack();
      } else {
        setImageUri(response.assets[0].uri);
        getLocationAndSendPunch(response.assets[0].uri);
      }
    });
  };

  const getLocationAndSendPunch = (uri) => {
    // 3️⃣ Get location
    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        // 4️⃣ Call API
        try {
          const formData = new FormData();
          formData.append('photo', {
            uri,
            type: 'image/jpeg',
            name: 'punch.jpg',
          });
          formData.append('type', type);
          formData.append('latitude', latitude);
          formData.append('longitude', longitude);

          const res = await api.post('/attendance/punch', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${access}`,
            },
          });

          if (type === 'punch_in') {
            dispatch(setPunchInTime(res.data.time));
          } else {
            dispatch(setPunchOutTime(res.data.time));
          }

          Alert.alert('Success', `${type.replace('_', ' ')} recorded!`);
          navigation.goBack();
        } catch (err) {
          console.error(err);
          Alert.alert('Error', 'Failed to punch, try again.');
          navigation.goBack();
        }
      },
      (err) => {
        console.log(err);
        Alert.alert('Location Error', 'Failed to get location');
        navigation.goBack();
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1e90ff" />
      <Text style={styles.text}>Processing {type.replace('_', ' ')}...</Text>
    </View>
  );
};

export default PunchInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  text: { color: '#fff', fontSize: 16, marginTop: 15 },
});

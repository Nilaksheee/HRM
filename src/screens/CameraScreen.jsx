import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { launchCamera } from "react-native-image-picker";
import Geolocation from "react-native-geolocation-service";
import { setPunchInTime, setPunchOutTime } from "../redux/permissionsSlice";
import { setImageUri, clearImageUri } from "../redux/cameraSlice";
import { requestPermissions } from "../base/permissions"; 
import attendenceapi from "../api/attendenceApi"; 

const CameraScreen = ({ navigation, route }) => {
  const { type } = route.params;
  const dispatch = useDispatch();
  const { access } = useSelector(state => state.auth);
  const imageUri = useSelector(state => state.camera.imageUri);

  const startPunchFlow = async () => {
    const hasPerm = await requestPermissions();
    if (!hasPerm) return navigation.goBack();

    launchCamera(
      { mediaType: "photo", saveToPhotos: true, quality: 0.8 },
      (res) => {
        if (res.didCancel) return navigation.goBack();
        if (res.errorCode) {
          Alert.alert("Camera Error", res.errorMessage);
          return navigation.goBack();
        }

        const uri = res.assets[0].uri;
        dispatch(setImageUri(uri));

        Geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const formData = new FormData();
              formData.append("image", { uri, type: "image/jpeg", name: "punch.jpg" });
              formData.append("type", type);
              formData.append("latitude", pos.coords.latitude);
              formData.append("longitude", pos.coords.longitude);

              // const response = await attendenceapi.post(
              //   "/attendenceapi/punch",
              //   formData,
              //   {
              //     headers: {
              //       "Content-Type": "multipart/form-data",
              //       Authorization: `Bearer ${access}`,
              //     },
              //   }
              // );

              const response = await punchIn.post(formData)

              if (type === "punch_in") dispatch(setPunchInTime(response.data.punch_in));
              else dispatch(setPunchOutTime(response.data.punch_out));

              Alert.alert("Success", `${type.replace("_", " ")} recorded!`, [
                {
                  text: "OK",
                  onPress: () => {
                    dispatch(clearImageUri());
                    navigation.goBack();
                  },
                },
              ]);
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to punch", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            }
          },
          (err) => {
            Alert.alert("Location Error", err.message);
            navigation.goBack();
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    );
  };

  useEffect(() => {
    startPunchFlow();
  }, []);

  return (
    <View style={styles.container}>
      {!imageUri ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      <Text style={styles.text}>Processing {type.replace("_", " ")}...</Text>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  image: { width: 300, height: 400, borderRadius: 12, marginBottom: 15 },
  text: { color: "#fff", fontSize: 16 },
});

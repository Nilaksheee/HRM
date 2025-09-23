import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const permissions = async () => {
  if (Platform.OS === 'android') {
    const perms = [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
    if (Platform.Version >= 33) perms.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
    else perms.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

    const granted = await PermissionsAndroid.requestMultiple(perms);
    const allGranted = Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED);

    if (!allGranted) {
      Alert.alert('Permission Denied', 'Camera, Storage & Location are required.');
      return false;
    }
  }
  return true;
};

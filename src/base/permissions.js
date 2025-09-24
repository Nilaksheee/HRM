// import { PermissionsAndroid, Platform, Alert } from 'react-native';

// // This function will always return true to bypass all permission checks
// export const requestPermissions = async () => {
//   return true;
// };

// // Mock the actual permission request to avoid system dialogs
// export const mockRequestCameraPermission = async () => {
//   return PermissionsAndroid.RESULTS.GRANTED;
// };

// export const mockRequestLocationPermission = async () => {
//   return PermissionsAndroid.RESULTS.GRANTED;
// };

// export const mockRequestStoragePermission = async () => {
//   return PermissionsAndroid.RESULTS.GRANTED;
// };

// // Keep the old function name for backward compatibility
// export const permissions = requestPermissions;


import { Platform, Alert } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

export const requestPermissions = async () => {
  try {
    const cameraStatus = await request(
      Platform.OS === "android" ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
    );
    const locationStatus = await request(
      Platform.OS === "android" ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    );

    if (cameraStatus === RESULTS.GRANTED && locationStatus === RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert(
        "Permission Denied",
        "Camera & Location permissions are required to punch in/out"
      );
      return false;
    }
  } catch (error) {
    console.log("Permission error:", error);
    return false;
  }
};


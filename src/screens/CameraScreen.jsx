// import React, { useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { launchCamera } from "react-native-image-picker";
// import Geolocation from "react-native-geolocation-service";
// import { setPunchInTime, setPunchOutTime } from "../redux/permissionsSlice";
// import { setImageUri, clearImageUri } from "../redux/cameraSlice";
// import { requestPermissions } from "../base/permissions";
// import { punchIn } from "../api/attendenceApi";

// const CameraScreen = ({ navigation, route }) => {
//   const { type } = route.params;
//   const dispatch = useDispatch();
//   const imageUri = useSelector(state => state.camera.imageUri);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [base64Image, setBase64Image] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [cameraLoading, setCameraLoading] = useState(false);
//   const [permissionsAsked, setPermissionsAsked] = useState(false);

//   // Permission Screen before camera
//   const handlePermissionRequest = async () => {
//     setCameraLoading(true);
//     const hasPerm = await requestPermissions();
//     setCameraLoading(false);
//     setPermissionsAsked(true);
//     if (hasPerm) {
//       openCamera();
//     } else {
//       Alert.alert("Permission Error", "Camera, Storage & Location permissions are required.");
//       navigation.goBack();
//     }
//   };

//   const openCamera = () => {
//     setCameraLoading(true);
//     launchCamera(
//       { 
//         mediaType: "photo", 
//         saveToPhotos: true, 
//         quality: 0.8, 
//         includeBase64: true 
//       },
//       (res) => {
//         setCameraLoading(false);
//         if (res.didCancel) return navigation.goBack();
//         if (res.errorCode) {
//           Alert.alert("Camera Error", res.errorMessage);
//           return navigation.goBack();
//         }
//         if (res.assets && res.assets.length > 0) {
//           const asset = res.assets[0];
//           dispatch(setImageUri(asset.uri));
//           setCapturedImage(asset.uri);
//           setBase64Image(asset.base64);
//           getLocation();
//         } else {
//           Alert.alert("Error", "Failed to capture image");
//           navigation.goBack();
//         }
//       }
//     );
//   };

//   const getLocation = () => {
//     Geolocation.getCurrentPosition(
//       (pos) => {
//         setLocation({
//           latitude: pos.coords.latitude.toString(),
//           longitude: pos.coords.longitude.toString()
//         });
//       },
//       (err) => {
//         Alert.alert("Location Error", err.message);
//         navigation.goBack();
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   const handleSubmit = async () => {
//     if (!capturedImage || !location) {
//       Alert.alert("Error", "Image or location not available");
//       return;
//     }
//     setLoading(true);
//     try {
//       const payload = {
//         latitude: location.latitude,
//         longitude: location.longitude,
//         status: type === "punch_in" ? "start" : "end",
//         image: base64Image,
//       };
//       const response = await punchIn(payload);
//       if (type === "punch_in") dispatch(setPunchInTime(response.punch_in));
//       else dispatch(setPunchOutTime(response.punch_out));
//       dispatch(clearImageUri());
//       Alert.alert(
//         "Success",
//         "Your attendance has been marked.",
//         [
//           {
//             text: "OK",
//             onPress: () => navigation.navigate("HomeScreen"),
//           },
//         ],
//         { cancelable: false }
//       );
//     } catch (err) {
//       setLoading(false);
//       Alert.alert("Error", "Failed to punch", [
//         { text: "OK", onPress: () => navigation.goBack() },
//       ]);
//     }
//   };

//   // 1. Show permission request screen if permissions not asked
//   if (!permissionsAsked) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Attendance requires Camera, Storage & Location</Text>
//         <TouchableOpacity style={styles.submitButton} onPress={handlePermissionRequest}>
//           {cameraLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.submitButtonText}>Allow & Proceed</Text>
//           )}
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retakeButton}>
//           <Text style={styles.retakeButtonText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // 2. Continue with camera screen after permission granted
//   return (
//     <View style={styles.container}>
//       {cameraLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#1e90ff" />
//           <Text style={styles.loadingText}>Opening camera...</Text>
//         </View>
//       ) : !capturedImage ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#1e90ff" />
//           <Text style={styles.loadingText}>Processing image...</Text>
//         </View>
//       ) : (
//         <>
//           <Image source={{ uri: capturedImage }} style={styles.image} />
//           <View style={styles.infoContainer}>
//             {location ? (
//               <Text style={styles.locationText}>
//                 Location: {location.latitude}, {location.longitude}
//               </Text>
//             ) : (
//               <View style={styles.locationLoading}>
//                 <ActivityIndicator size="small" color="#1e90ff" />
//                 <Text style={styles.locationLoadingText}>Getting location...</Text>
//               </View>
//             )}
//           </View>
//           <TouchableOpacity 
//             style={[styles.submitButton, (!location || loading) && styles.disabledButton]} 
//             onPress={handleSubmit}
//             disabled={!location || loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitButtonText}>Submit {type.replace("_", " ")}</Text>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={styles.retakeButton} 
//             onPress={openCamera}
//             disabled={loading}
//           >
//             <Text style={styles.retakeButtonText}>Retake Photo</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//     padding: 20,
//   },
//   loadingContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loadingText: {
//     color: "#fff",
//     fontSize: 16,
//     marginTop: 10,
//   },
//   image: {
//     width: 300,
//     height: 400,
//     borderRadius: 12,
//     marginBottom: 15,
//   },
//   infoContainer: {
//     width: "100%",
//     marginBottom: 20,
//   },
//   locationText: {
//     fontSize: 14,
//     color: "#fff",
//     marginBottom: 10,
//   },
//   locationLoading: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   locationLoadingText: {
//     color: "#fff",
//     fontSize: 14,
//     marginLeft: 10,
//   },
//   submitButton: {
//     backgroundColor: "#1e90ff",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   disabledButton: {
//     backgroundColor: "#1e90ff80",
//   },
//   submitButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   retakeButton: {
//     backgroundColor: "transparent",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     width: "100%",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#1e90ff",
//     marginTop: 10,
//   },
//   retakeButtonText: {
//     color: "#1e90ff",
//     fontSize: 16,
//   },
//   text: {
//     color: "#fff",
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: "center",
//   },
// });

// export default CameraScreen;
// import React, { useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { launchCamera } from "react-native-image-picker";
// import Geolocation from "react-native-geolocation-service";
// import { setPunchInTime, setPunchOutTime } from "../redux/permissionsSlice";
// import { setImageUri, clearImageUri } from "../redux/cameraSlice";
// import { requestPermissions } from "../base/permissions";
// import { punchIn } from "../api/attendenceApi";

// const CameraScreen = ({ navigation, route }) => {
//   const { type } = route.params;
//   const dispatch = useDispatch();
//   const imageUri = useSelector(state => state.camera.imageUri);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [base64Image, setBase64Image] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [cameraLoading, setCameraLoading] = useState(false);
//   const [permissionsAsked, setPermissionsAsked] = useState(false);

//   // Permission Screen before camera
//   const handlePermissionRequest = async () => {
//     setCameraLoading(true);
//     const hasPerm = await requestPermissions();
//     setCameraLoading(false);
//     setPermissionsAsked(true);
//     if (hasPerm) {
//       openCamera();
//     } else {
//       Alert.alert("Permission Error", "Camera, Storage & Location permissions are required.");
//       navigation.goBack();
//     }
//   };

//   const openCamera = () => {
//     setCameraLoading(true);
//     launchCamera(
//       {
//         mediaType: "photo",
//         saveToPhotos: true,
//         quality: 0.8,
//         includeBase64: true
//       },
//       (res) => {
//         setCameraLoading(false);
//         if (res.didCancel) return navigation.goBack();
//         if (res.errorCode) {
//           Alert.alert("Camera Error", res.errorMessage);
//           return navigation.goBack();
//         }
//         if (res.assets && res.assets.length > 0) {
//           const asset = res.assets[0];
//           dispatch(setImageUri(asset.uri));
//           setCapturedImage(asset.uri);
//           setBase64Image(asset.base64);
//           getLocation();
//         } else {
//           Alert.alert("Error", "Failed to capture image");
//           navigation.goBack();
//         }
//       }
//     );
//   };

//   const getLocation = () => {
//     // Mock location data instead of using Geolocation
//     // This bypasses the need for actual location permissions
//     setLocation({
//       latitude: "37.7749",  // Default latitude (San Francisco)
//       longitude: "-122.4194" // Default longitude (San Francisco)
//     });

//     // Comment out the actual Geolocation call to avoid permission errors
//     /*
//     Geolocation.getCurrentPosition(
//       (pos) => {
//         setLocation({
//           latitude: pos.coords.latitude.toString(),
//           longitude: pos.coords.longitude.toString()
//         });
//       },
//       (err) => {
//         Alert.alert("Location Error", err.message);
//         navigation.goBack();
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//     */
//   };

//   const handleSubmit = async () => {
//   if (!capturedImage || !location) {
//     Alert.alert("Error", "Image or location not available");
//     return;
//   }
//   setLoading(true);

//   // Prepare payload for submission
//   const payload = {
//     latitude: location.latitude,
//     longitude: location.longitude,
//     status: type === "punch_in" ? "start" : "end",
//     image: base64Image,
//   };

//   // Log form data to console (visible in React DevTools console)
//   console.log("Submitting form data:", payload);

//   try {
//     const response = await punchIn(payload);

//     if (type === "punch_in") dispatch(setPunchInTime(response.punch_in));
//     else dispatch(setPunchOutTime(response.punch_out));

//     dispatch(clearImageUri());

//     Alert.alert(
//       "Success",
//       "Your attendance has been marked.",
//       [
//         {
//           text: "OK",
//           onPress: () => navigation.navigate("HomeScreen"),
//         },
//       ],
//       { cancelable: false }
//     );
//   } catch (err) {
//     setLoading(false);
//     Alert.alert("Error", "Failed to punch", [
//       { text: "OK", onPress: () => navigation.goBack() },
//     ]);
//   }
// };


//   // 1. Show permission request screen if permissions not asked
//   if (!permissionsAsked) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Attendance requires Camera, Storage & Location</Text>
//         <TouchableOpacity style={styles.submitButton} onPress={handlePermissionRequest}>
//           {cameraLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.submitButtonText}>Allow & Proceed</Text>
//           )}
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retakeButton}>
//           <Text style={styles.retakeButtonText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // 2. Continue with camera screen after permission granted
//   return (
//     <View style={styles.container}>
//       {cameraLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#1e90ff" />
//           <Text style={styles.loadingText}>Opening camera...</Text>
//         </View>
//       ) : !capturedImage ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#1e90ff" />
//           <Text style={styles.loadingText}>Processing image...</Text>
//         </View>
//       ) : (
//         <>
//           <Image source={{ uri: capturedImage }} style={styles.image} />
//           <View style={styles.infoContainer}>
//             {location ? (
//               <Text style={styles.locationText}>
//                 Location: {location.latitude}, {location.longitude}
//               </Text>
//             ) : (
//               <View style={styles.locationLoading}>
//                 <ActivityIndicator size="small" color="#1e90ff" />
//                 <Text style={styles.locationLoadingText}>Getting location...</Text>
//               </View>
//             )}
//           </View>
//           <TouchableOpacity
//             style={[styles.submitButton, (!location || loading) && styles.disabledButton]}
//             onPress={handleSubmit}
//             disabled={!location || loading}
//           >
//             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit {type.replace("_", " ")}</Text>}
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.retakeButton} onPress={openCamera} disabled={loading}>
//             <Text style={styles.retakeButtonText}>Retake Photo</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000", padding: 20,
//   },
//   loadingContainer: { alignItems: "center", justifyContent: "center" },
//   loadingText: { color: "#fff", fontSize: 16, marginTop: 10 },
//   image: { width: 300, height: 400, borderRadius: 12, marginBottom: 15 },
//   infoContainer: { width: "100%", marginBottom: 20 },
//   locationText: { fontSize: 14, color: "#fff", marginBottom: 10 },
//   locationLoading: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   locationLoadingText: { color: "#fff", fontSize: 14, marginLeft: 10 },
//   submitButton: {
//     backgroundColor: "#1e90ff", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 10,
//   },
//   disabledButton: { backgroundColor: "#1e90ff80" },
//   submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   retakeButton: {
//     backgroundColor: "transparent", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, width: "100%", alignItems: "center", borderWidth: 1, borderColor: "#1e90ff", marginTop: 10,
//   },
//   retakeButtonText: { color: "#1e90ff", fontSize: 16 },
//   text: { color: "#fff", fontSize: 16, marginBottom: 20, textAlign: "center" },
// });

// export default CameraScreen;


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { launchCamera } from "react-native-image-picker";
import Geolocation from "react-native-geolocation-service";
import { setPunchInTime, setPunchOutTime } from "../redux/PermissionSlice";
import { setImageUri, clearImageUri } from "../redux/cameraSlice";
import { markAttendance } from "../api/attendenceApi";
import { requestPermissions } from "../base/permissions";

const CameraScreen = ({ navigation, route }) => {
  const { type } = route.params; // "punch_in" or "punch_out"
  const dispatch = useDispatch();
  const imageUri = useSelector((state) => state.camera.imageUri);

  const [capturedImage, setCapturedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      setCameraLoading(true);
      const granted = await requestPermissions();
      setCameraLoading(false);

      if (!granted) {
        Alert.alert(
          "Permissions Required",
          "Camera, Storage, and Location permissions are required to mark attendance.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
        return;
      }
      setPermissionsGranted(true);
      openCamera();
    };

    checkPermissions();
  }, []);

  // Open Camera
  const openCamera = () => {
    setCameraLoading(true);
    launchCamera(
      {
        mediaType: "photo",
        saveToPhotos: true,
        quality: 0.8,
        includeBase64: true,
      },
      (res) => {
        setCameraLoading(false);
        if (res.didCancel) return navigation.goBack();
        if (res.errorCode) {
          Alert.alert("Camera Error", res.errorMessage || "Unknown error");
          return navigation.goBack();
        }

        if (res.assets && res.assets.length > 0) {
          const asset = res.assets[0];
          dispatch(setImageUri(asset.uri));
          setCapturedImage(asset.uri);
          setBase64Image(asset.base64);
          getLocation();
        } else {
          Alert.alert("Error", "Failed to capture image");
          navigation.goBack();
        }
      }
    );
  };

  // Get Location
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        });
      },
      (err) => {
        Alert.alert("Location Error", err.message || "Unable to fetch location", [
          { text: "Retry", onPress: getLocation },
          { text: "Cancel", onPress: () => navigation.goBack(), style: "cancel" },
        ]);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Submit Punch
  const handleSubmit = async () => {
    if (!capturedImage || !location) {
      Alert.alert("Error", "Image or location not available");
      return;
    }

    setLoading(true);

    const payload = {
      latitude: location.latitude,
      longitude: location.longitude,
      status: type === "punch_in" ? "start" : "end",
      image: base64Image,
    };
  

    try {
      const response = await markAttendance(payload);
      console.log("Punch API response:", response);

      if (!response) throw new Error("No response from server");

      // Handle punch-in / punch-out response safely
      if (type === "punch_in") {
        if (response.punch_in) {
          dispatch(setPunchInTime(response.punch_in));
        } else {
          throw new Error(response.message || "Punch-in failed");
        }
      } else {
        if (response.punch_out) {
          dispatch(setPunchOutTime(response.punch_out));
        } else {
          throw new Error(response.message || "Punch-out failed");
        }
      }

      dispatch(clearImageUri());
      Alert.alert("Success", "Attendance marked successfully", [
        { text: "OK", onPress: () => navigation.navigate("HomeScreen") },
      ]);
    } catch (err) {
      console.log("Punch API error:", err);
      Alert.alert(
        "Error",
        err.message || "Failed to mark attendance",
        [
          { text: "Retry", onPress: handleSubmit },
          { text: "Cancel", onPress: () => navigation.goBack(), style: "cancel" },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // UI Loading States
  if (cameraLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.text}>Opening camera...</Text>
      </View>
    );
  }

  if (!capturedImage) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.text}>Waiting for camera capture...</Text>
      </View>
    );
  }

  // Main UI
  return (
    <View style={styles.container}>
      <Image source={{ uri: capturedImage }} style={styles.image} />
      <View style={styles.infoContainer}>
        {location ? (
          <Text style={styles.locationText}>
            Location: {location.latitude}, {location.longitude}
          </Text>
        ) : (
          <View style={styles.locationLoading}>
            <ActivityIndicator size="small" color="#1e90ff" />
            <Text style={styles.locationLoadingText}>Getting location...</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (!location || loading) && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!location || loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit {type.replace("_", " ")}</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.retakeButton} onPress={openCamera} disabled={loading}>
        <Text style={styles.retakeButtonText}>Retake Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000", padding: 20 },
  image: { width: 300, height: 400, borderRadius: 12, marginBottom: 15 },
  infoContainer: { width: "100%", marginBottom: 20 },
  locationText: { fontSize: 14, color: "#fff", marginBottom: 10 },
  locationLoading: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  locationLoadingText: { color: "#fff", fontSize: 14, marginLeft: 10 },
  submitButton: { backgroundColor: "#1e90ff", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 10 },
  disabledButton: { backgroundColor: "#1e90ff80" },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  retakeButton: { backgroundColor: "transparent", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, width: "100%", alignItems: "center", borderWidth: 1, borderColor: "#1e90ff", marginTop: 10 },
  retakeButtonText: { color: "#1e90ff", fontSize: 16 },
  text: { color: "#fff", fontSize: 16, marginTop: 20, textAlign: "center" },
});

export default CameraScreen;












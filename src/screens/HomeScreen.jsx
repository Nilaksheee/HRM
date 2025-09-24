// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
// import { useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
// import { requestPermissions } from "../base/permissions";

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const { punchInTime, punchOutTime } = useSelector(state => state.permissions);

//   const [currentTime, setCurrentTime] = useState("");

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date();
//       setCurrentTime(now.toLocaleTimeString());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

  // const handlePunchIn = () => {
  //   // Directly navigate to CameraScreen without permission checks
  //   navigation.navigate("CameraScreen", { type: "punch_in" });
  // };

  // const handlePunchOut = () => {
  //   // Directly navigate to CameraScreen without permission checks
  //   navigation.navigate("CameraScreen", { type: "punch_out" });
  // };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📅 Attendance</Text>

//       {/* Digital Clock */}
//       <View style={styles.clockContainer}>
//         <Text style={styles.clockText}>{currentTime}</Text>
//       </View>

//       {/* Punch In/Out Status */}
//       <View style={styles.card}>
//         <View style={styles.timeRow}>
//           <Text style={styles.timeLabel}>Punch In</Text>
//           <Text style={styles.timeValue}>{punchInTime || "--:--"}</Text>
//         </View>
//         <View style={styles.timeRow}>
//           <Text style={styles.timeLabel}>Punch Out</Text>
//           <Text style={styles.timeValue}>{punchOutTime || "--:--"}</Text>
//         </View>
//       </View>

//       {/* Punch Buttons */}
//       {!punchInTime && (
//         <TouchableOpacity
//           style={styles.punchInBtn}
//           onPress={handlePunchIn}
//         >
//           <Text style={styles.btnText}>📸 Punch In</Text>
//         </TouchableOpacity>
//       )}

//       {punchInTime && !punchOutTime && (
//         <TouchableOpacity
//           style={styles.punchOutBtn}
//           onPress={handlePunchOut}
//         >
//           <Text style={styles.btnText}>📸 Punch Out</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f8f9fd", justifyContent: "center" },
//   title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },

//   clockContainer: {
//     backgroundColor: "#1e90ff",
//     padding: 20,
//     borderRadius: 20,
//     alignItems: "center",
//     marginBottom: 25,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   clockText: { fontSize: 40, fontWeight: "bold", color: "#fff" },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 30,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   timeRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
//   timeLabel: { fontSize: 18, fontWeight: "600", color: "#444" },
//   timeValue: { fontSize: 18, fontWeight: "bold", color: "#1e90ff" },

//   punchInBtn: {
//     backgroundColor: "#000",
//     padding: 18,
//     borderRadius: 15,
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   punchOutBtn: {
//     backgroundColor: "#ff3b30",
//     padding: 18,
//     borderRadius: 15,
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   btnText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
// });





// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
// import { Calendar } from "react-native-calendars";

// import { setPunchInTime, setPunchOutTime } from "../redux/permissionsSlice";
// import { getMonthlyAttendance } from "../api/attendanceApi";

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const { punchInTime, punchOutTime } = useSelector((state) => state.permissions);

//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
//   const [selectedTab, setSelectedTab] = useState("Home");
//   const [loading, setLoading] = useState(false);
//   const [monthAttendance, setMonthAttendance] = useState({});
//   const [attendanceSummary, setAttendanceSummary] = useState({
//     present: 0,
//     absent: 0,
//     late: 0,
//   });
//   const [showCalendar, setShowCalendar] = useState(true);

//   // Clock
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Fetch monthly attendance
//   useEffect(() => {
//     fetchMonthlyAttendance();
//   }, []);

//   const fetchMonthlyAttendance = async () => {
//     setLoading(true);
//     try {
//       const data = await getMonthlyAttendance(); // call your API
//       const marked = processAttendanceForCalendar(data);
//       setMonthAttendance(marked);
//       setAttendanceSummary(calculateSummary(data));
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Failed to fetch attendance.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processAttendanceForCalendar = (data) => {
//     const marked = {};
//     Object.keys(data).forEach((date) => {
//       let color = "#ccc"; // default for null
//       switch (data[date]) {
//         case "present":
//           color = "green";
//           break;
//         case "absent":
//           color = "red";
//           break;
//         case "outofrange":
//           color = "gray";
//           break;
//         case "not_punchout":
//           color = "orange";
//           break;
//         default:
//           color = "#ccc";
//       }
//       marked[date] = { selected: true, selectedColor: color };
//     });
//     return marked;
//   };

//   const calculateSummary = (data) => {
//     let present = 0,
//       absent = 0,
//       late = 0;
//     Object.values(data).forEach((v) => {
//       if (v === "present") present++;
//       else if (v === "absent") absent++;
//       else if (v === "not_punchout") late++;
//     });
//     return { present, absent, late };
//   };

//   // Handle Punch In
//   const handlePunchIn = () => {
//     if (punchInTime) {
//       Alert.alert("Info", "You have already punched in today.");
//       return;
//     }
//     navigation.navigate("CameraScreen", { type: "punch_in" });
//   };

//   // Handle Punch Out
//   const handlePunchOut = () => {
//     if (!punchInTime) {
//       Alert.alert("Info", "You need to punch in first.");
//       return;
//     }
//     if (punchOutTime) {
//       Alert.alert("Info", "You have already punched out today.");
//       return;
//     }
//     navigation.navigate("CameraScreen", { type: "punch_out" });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Location */}
//         <View style={styles.locationContainer}>
//           <Icon name="location-outline" size={18} color="#fff" />
//           <Text style={styles.locationText}> Thambu Chetty St, Chennai</Text>
//         </View>

//         {/* Welcome */}
//         <Text style={styles.welcomeText}>Welcome, Arun Kumar</Text>

//         {/* Tab Switch */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === "Home" && styles.activeTab]}
//             onPress={() => setSelectedTab("Home")}
//           >
//             <Text style={[styles.tabText, selectedTab === "Home" && styles.activeTabText]}>Home</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === "Office" && styles.activeTab]}
//             onPress={() => setSelectedTab("Office")}
//           >
//             <Text style={[styles.tabText, selectedTab === "Office" && styles.activeTabText]}>Office</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Shift Card */}
//         <View style={styles.card}>
//           <Text style={styles.shiftText}>GENERAL SHIFT</Text>
//           <Text style={styles.timeText}>{currentTime}</Text>

//           <View style={styles.timeRow}>
//             <Text style={styles.timeLabel}>Punch In</Text>
//             <Text style={styles.timeValue}>{punchInTime || "--:--"}</Text>
//           </View>
//           <View style={styles.timeRow}>
//             <Text style={styles.timeLabel}>Punch Out</Text>
//             <Text style={styles.timeValue}>{punchOutTime || "--:--"}</Text>
//           </View>

//           {!punchInTime && (
//             <TouchableOpacity style={styles.punchInBtn} onPress={handlePunchIn}>
//               <Text style={styles.btnText}>📸 Punch In</Text>
//             </TouchableOpacity>
//           )}
//           {punchInTime && !punchOutTime && (
//             <TouchableOpacity style={styles.punchOutBtn} onPress={handlePunchOut}>
//               <Text style={styles.btnText}>📸 Punch Out</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Calendar Toggle */}
//         <TouchableOpacity
//           style={styles.toggleCalendarBtn}
//           onPress={() => setShowCalendar(!showCalendar)}
//         >
//           <Text style={styles.toggleCalendarText}>{showCalendar ? "Hide Calendar" : "Show Calendar"}</Text>
//         </TouchableOpacity>

//         {/* Calendar */}
//         {showCalendar && (
//           <View style={styles.calendarCard}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#2c6fff" style={{ marginVertical: 20 }} />
//             ) : (
//               <Calendar
//                 markingType={"simple"}
//                 markedDates={monthAttendance}
//                 style={{ borderRadius: 20, marginHorizontal: 16 }}
//               />
//             )}
//           </View>
//         )}

//         {/* Attendance Summary */}
//         <View style={styles.attendanceCard}>
//           <View style={styles.attendanceHeader}>
//             <Text style={styles.attendanceTitle}>Attendance for this Month</Text>
//           </View>
//           <View style={styles.row}>
//             <View style={styles.attendanceBox}>
//               <Text style={styles.present}>{attendanceSummary.present}</Text>
//               <Text style={styles.attendanceLabel}>Present</Text>
//             </View>
//             <View style={styles.attendanceBox}>
//               <Text style={styles.absent}>{attendanceSummary.absent}</Text>
//               <Text style={styles.attendanceLabel}>Absents</Text>
//             </View>
//             <View style={styles.attendanceBox}>
//               <Text style={styles.late}>{attendanceSummary.late}</Text>
//               <Text style={styles.attendanceLabel}>Late in</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// // Styles (same as your previous code)
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8f9ff" },
//   locationContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#2c6fff", padding: 12, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
//   locationText: { color: "#fff", fontSize: 14 },
//   welcomeText: { fontSize: 18, fontWeight: "600", marginVertical: 16, marginLeft: 16 },
//   tabContainer: { flexDirection: "row", alignSelf: "center", backgroundColor: "#e6edff", borderRadius: 25, marginBottom: 20 },
//   tab: { paddingVertical: 10, paddingHorizontal: 40, borderRadius: 25 },
//   activeTab: { backgroundColor: "#2c6fff" },
//   tabText: { fontSize: 14, color: "#555", fontWeight: "500" },
//   activeTabText: { color: "#fff" },
//   card: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, marginBottom: 20 },
//   shiftText: { color: "green", fontWeight: "600", marginBottom: 8, textAlign: "center" },
//   timeText: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 12 },
//   punchInBtn: { backgroundColor: "#2c6fff", padding: 16, borderRadius: 15, marginVertical: 10, alignItems: "center" },
//   punchOutBtn: { backgroundColor: "#ff3b30", padding: 16, borderRadius: 15, marginVertical: 10, alignItems: "center" },
//   btnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
//   row: { flexDirection: "row", justifyContent: "space-between" },
//   timeRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
//   timeLabel: { fontSize: 16, fontWeight: "600" },
//   timeValue: { fontSize: 16, fontWeight: "700", color: "#2c6fff" },
//   toggleCalendarBtn: { backgroundColor: "#e6edff", marginHorizontal: 16, padding: 12, borderRadius: 20, alignItems: "center", marginBottom: 10 },
//   toggleCalendarText: { color: "#2c6fff", fontWeight: "600" },
//   calendarCard: { marginBottom: 20 },
//   attendanceCard: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 20, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, marginBottom: 20 },
//   attendanceHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
//   attendanceTitle: { fontSize: 16, fontWeight: "600" },
//   attendanceBox: { alignItems: "center", flex: 1 },
//   present: { color: "green", fontSize: 18, fontWeight: "700" },
//   absent: { color: "red", fontSize: 18, fontWeight: "700" },
//   late: { color: "orange", fontSize: 18, fontWeight: "700" },
//   attendanceLabel: { fontSize: 12, color: "#555", marginTop: 4 },
// });




// HomeScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Geolocation from "react-native-geolocation-service";
import { getMonthlyAttendance } from "../api/attendanceApi";
import { requestPermissions } from "../base/permissions"; // custom permission handler

const HomeScreen = () => {
  const navigation = useNavigation();
  const userApiData = useSelector((state) => state.auth.userApiData); // your replacement API user
  const { punchInTime, punchOutTime } = useSelector(
    (state) => state.permissions
  );

  const [loading, setLoading] = useState(false);
  const [monthAttendance, setMonthAttendance] = useState({});
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
  });
  const [location, setLocation] = useState(null);

  //use effect [] https://3gxqzdsp-2000.inc1.devtunnels.ms/api/v1/attendance/today/

  // Request location on first open
  const fetchLocation = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    Geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.log(err);
        Alert.alert("Error", "Failed to get location.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Fetch monthly attendance
  const fetchMonthlyAttendance = async () => {
    setLoading(true);
    try {
      const data = await getMonthlyAttendance();
      setMonthAttendance(processAttendanceForCalendar(data));
      setAttendanceSummary(calculateSummary(data));
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMonthlyAttendance();
      fetchLocation();
    }, [])
  );

  const processAttendanceForCalendar = (data) => {
    const marked = {};
    Object.keys(data).forEach((date) => {
      let color = "#ccc";
      switch (data[date]) {
        case "present":
          color = "green";
          break;
        case "absent":
          color = "red";
          break;
        case "not_punchout":
          color = "orange";
          break;
      }
      marked[date] = { selected: true, selectedColor: color };
    });
    return marked;
  };

  const calculateSummary = (data) => {
    let present = 0,
      absent = 0,
      late = 0;
    Object.values(data).forEach((v) => {
      if (v === "present") present++;
      else if (v === "absent") absent++;
      else if (v === "not_punchout") late++;
    });
    return { present, absent, late };
  };

  // Punch Handlers
  const handlePunchIn = () => {
    if (punchInTime) {
      Alert.alert("Info", "You have already punched in today.");
      return;
    }
    navigation.navigate("CameraScreen", { type: "punch_in" });
  };

  const handlePunchOut = () => {
    if (!punchInTime) {
      Alert.alert("Info", "You need to punch in first.");
      return;
    }
    if (punchOutTime) {
      Alert.alert("Info", "You have already punched out today.");
      return;
    }
    navigation.navigate("CameraScreen", { type: "punch_out" });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome */}
      <Text style={styles.welcomeText}>
        Welcome, {userApiData?.name || "User"}
      </Text>

      {/* Punch Card */}
      <View style={styles.card}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Punch In:</Text>
          <Text style={styles.timeValue}>{punchInTime || "--:--"}</Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Punch Out:</Text>
          <Text style={styles.timeValue}>{punchOutTime || "--:--"}</Text>
        </View>


// 
        {!punchInTime && (
          <TouchableOpacity style={styles.punchInBtn} onPress={handlePunchIn}>
            <Text style={styles.btnText}>📸 Punch In</Text>
          </TouchableOpacity>
        )}

        {punchInTime && !punchOutTime && (
          <TouchableOpacity
            style={styles.punchOutBtn}
            onPress={handlePunchOut}
          >
            <Text style={styles.btnText}>📸 Punch Out</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Calendar always visible */}
      <View style={styles.calendarContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2c6fff" />
        ) : (
          <Calendar
            markingType={"simple"}
            markedDates={monthAttendance}
            style={{ borderRadius: 10 }}
          />
        )}
      </View>

      {/* Attendance Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: "green" }]}>
            {attendanceSummary.present}
          </Text>
          <Text style={styles.summaryLabel}>Present</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: "red" }]}>
            {attendanceSummary.absent}
          </Text>
          <Text style={styles.summaryLabel}>Absent</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: "orange" }]}>
            {attendanceSummary.late}
          </Text>
          <Text style={styles.summaryLabel}>Late</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9ff", padding: 16 },
  welcomeText: { fontSize: 20, fontWeight: "600", marginVertical: 8 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  timeLabel: { fontSize: 16, fontWeight: "600", color: "#444" },
  timeValue: { fontSize: 16, fontWeight: "700", color: "#007AFF" },
  punchInBtn: {
    backgroundColor: "#2c6fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  punchOutBtn: {
    backgroundColor: "#ff3b30",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  btnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  calendarContainer: { marginBottom: 16 },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
  },
  summaryBox: { alignItems: "center", flex: 1 },
  summaryValue: { fontSize: 18, fontWeight: "700" },
  summaryLabel: { fontSize: 12, color: "#555", marginTop: 4 },
});

export default HomeScreen;




import React, { useState, useCallback } from "react";
import { // Removed useEffect as it's replaced by useFocusEffect now using state
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
// Removed: import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Geolocation from "react-native-geolocation-service";
import { getMonthlyAttendance, getTodayAttendance } from "../api/attendenceApi";
import { requestPermissions } from "../base/permissions";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [today, setToday] = useState([]);
  // const userApiData = useSelector((state) => state.auth.userApiData); // Removed
  // const { punchInTime, punchOutTime } = useSelector((state) => state.permissions); // Removed

  // 1. New local state for punch times
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  // 2. Simplified user data (assuming it's still available or can be fetched)
  // NOTE: If 'user' comes from Redux, you will need a separate API call to fetch it here.
  // For now, we'll mock the user or assume it's passed via props/context.
  const user = { name: "Employee" }; // Placeholder, replace with actual user data logic
  
  const [loading, setLoading] = useState(false);
  const [monthAttendance, setMonthAttendance] = useState({});
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
  });
  const [location, setLocation] = useState(null);

  // Fetch location (unchanged)
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

  // Fetch monthly attendance (unchanged logic, only Redux usage removed)
  const fetchMonthlyAttendance = async () => {
    setLoading(true);
    const result = await getMonthlyAttendance();
    if (result.success) {
      setMonthAttendance(processAttendanceForCalendar(result.data));
      setAttendanceSummary(calculateSummary(result.data));
    } else {
      Alert.alert("Error", result.error);
    }
    setLoading(false);
  };

  // 3. MODIFIED: Fetch today’s attendance to update local state
  const fetchTodayAttendance = async () => {
    try {
      const result = await getTodayAttendance();
      if (result.success && result.data && result.data.length > 0) {
        const todayAttendance = result.data[0];
        
        // **Update local state with API data**
        const apiPunchIn = todayAttendance.punch_in || null; // Assuming your API field is 'punch_in'
        const apiPunchOut = todayAttendance.punch_out || null; // Assuming your API field is 'punch_out'

        setPunchInTime(apiPunchIn);
        setPunchOutTime(apiPunchOut);

        setToday(result.data);
        console.log("Today's Attendance from API:", todayAttendance);
      } else if (result.success) {
        // Clear times if no attendance record is found for today
        setPunchInTime(null);
        setPunchOutTime(null);
        setToday([]);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to fetch today's attendance.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMonthlyAttendance();
      fetchTodayAttendance();
      fetchLocation();
    }, [])
  );

  // Convert API attendance to calendar marking (unchanged)
  const processAttendanceForCalendar = (data) => {
    const marked = {};
    Object.keys(data).forEach((date) => {
      let color = "black";
      switch (data[date]) {
        case "present":
        case "autoclosed":
          color = "green";
          break;
        case "absent":
          color = "red";
          break;
        case "not_punchout":
          color = "orange";
          break;
        default:
          color = "black";
      }

      marked[date] = {
        customStyles: {
          text: { color: color, fontWeight: "bold" },
        },
      };
    });
    return marked;
  };

  const calculateSummary = (data) => {
    let present = 0,
      absent = 0,
      late = 0;
    Object.values(data).forEach((v) => {
      if (v === "present" || v === "autoclosed") present++;
      else if (v === "absent") absent++;
      else if (v === "not_punchout") late++;
    });
    return { present, absent, late };
  };

  // Punch Handlers (unchanged, navigate to CameraScreen)
  const handlePunchIn = () => {
    navigation.navigate("CameraScreen", { type: "punch_in" });
  };

  const handlePunchOut = () => {
    navigation.navigate("CameraScreen", { type: "punch_out" });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome */}
      <Text style={styles.welcomeText}>
        Welcome, {user?.name || "User"}
      </Text>

      {/* Punch Card - Now uses local state */}
      <View style={styles.card}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Punch In:</Text>
          <Text style={styles.timeValue}>{punchInTime || "--:--"}</Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Punch Out:</Text>
          <Text style={styles.timeValue}>{punchOutTime || "--:--"}</Text>
        </View>

        {/* Button logic remains the same, based on local state */}
        {!punchInTime && (
          <TouchableOpacity style={styles.punchInBtn} onPress={handlePunchIn}>
            <Icon name="camera-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Punch In</Text>
          </TouchableOpacity>
        )}

        {punchInTime && !punchOutTime && (
          <TouchableOpacity style={styles.punchOutBtn} onPress={handlePunchOut}>
            <Icon name="camera-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Punch Out</Text>
          </TouchableOpacity>
        )}

        {/* If both times are present, allow for a new punch in (or maybe disable/show success) */}
        {punchInTime && punchOutTime && (
          // In a real app, this should probably be a disabled/success state
          // or a button for the *next* day if your logic allows re-punching
          <View style={styles.punchSuccess}>
              <Text style={styles.punchSuccessText}>Punched In & Out for Today!</Text>
          </View>
        )}


      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2c6fff" />
        ) : (
          <Calendar
            markingType={"custom"}
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
          <Text style={styles.summaryLabel}>Late In</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

// Added a style for Punch Success to replace the repetitive "Punch In" button
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9ff", padding: 16 },
  welcomeText: { fontSize: 18, fontWeight: "600", marginVertical: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  timeLabel: { fontSize: 16, fontWeight: "500" },
  timeValue: { fontSize: 16, fontWeight: "700", color: "#2c6fff" },
  btnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  punchInBtn: {
    backgroundColor: "#2c6fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  punchOutBtn: {
    backgroundColor: "#ff3b30",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  punchSuccess: {
    backgroundColor: "#28a745", // Success Green
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  punchSuccessText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginBottom: 20,
  },
  summaryBox: { alignItems: "center" },
  summaryValue: { fontSize: 20, fontWeight: "700" },
  summaryLabel: { fontSize: 14, color: "#555", marginTop: 4 },
});
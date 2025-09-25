import React, { useState, useCallback,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Geolocation from "react-native-geolocation-service";
import { getMonthlyAttendance, getTodayAttendance } from "../api/attendenceApi";
import { requestPermissions } from "../base/permissions";
import Icon from "react-native-vector-icons/Ionicons";
import { getuserProfile } from "../api/attendenceApi"; 

const HomeScreen = () => {
  const navigation = useNavigation();
  const [today, setToday] = useState([]);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const user = { name: "Employee" }; // Placeholder
  const [loading, setLoading] = useState(false);
  const [monthAttendance, setMonthAttendance] = useState({});
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
  });
  const [location, setLocation] = useState(null);
  const [userData,setUserData] = useState(null);

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
console.log(today)
  const fetchTodayAttendance = async () => {
    try {
      const result = await getTodayAttendance();
      if (result.success && result.data && result.data.data) {
        console.log("Today's Attendance from API:", result.data);

        // Store the entire data array for button logic
        setToday(result.data.data || []);

        // Keep existing time display logic
        const lastPunchOut = result.data.data
          .filter(entry => entry && entry.punchOut !== null)
          .slice(-1)[0]?.punchOut;

        setPunchInTime(result.data.data[0]?.punchIn || null);
        setPunchOutTime(lastPunchOut || null);
      } else {
        // If no data or unsuccessful, set empty array
        console.log("No attendance data found for today");
        setToday([]);
        setPunchInTime(null);
        setPunchOutTime(null);
      }
    } catch (err) {
      console.log("Error fetching today's attendance:", err);
      setToday([]); // Set empty array on error
      setPunchInTime(null);
      setPunchOutTime(null);
      Alert.alert("Error", "Failed to fetch today's attendance.");
    }
  };


  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getuserProfile();
      if (res.success) {
        console.log("User Profile Response:", res.data); // ✅ data in console
        setUserData(res.data);
      } else {
        console.log("Error fetching user:", res.error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
 
      fetchMonthlyAttendance();
      fetchTodayAttendance();
      fetchLocation();
    }, [])
  );

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

  const handlePunchIn = () => {
    navigation.navigate("CameraScreen", { type: "punch_in" });
  };

  const handlePunchOut = () => {
    navigation.navigate("CameraScreen", { type: "punch_out" });
  };

  // Helper function to format the timestamp to IST
  const formatTime = (time) => {
    if (!time) return "--:--";
    const date = new Date(time);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Fixed button rendering function
  const renderAttendanceButton = () => {
    console.log("Today array length:", today?.length);
    console.log("Today array:", today);
    
    // Case 1: No attendance data - show punch in
    if (!today || today.length === 0) {
      console.log("Rendering: No data - Punch In");
      return (
        <TouchableOpacity style={styles.punchInBtn} onPress={handlePunchIn}>
          <Icon name="camera-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Punch In</Text>
        </TouchableOpacity>
      );
    }

    // Get the last record
    const lastRecord = today[today.length - 1];
    console.log("Last record:", lastRecord);
    
    // Case 2: Last record has punch-in but no punch-out - show punch out
    if (lastRecord && lastRecord.punchOut) {
      console.log("Rendering: Need to punch out");
      return (
      <TouchableOpacity style={styles.punchInBtn} onPress={handlePunchIn}>
        <Icon name="camera-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.btnText}>Punch In</Text>
      </TouchableOpacity>
    );
      
    }

    // Case 3: Default - show punch in (including when both punch-in and punch-out exist)
    console.log("Rendering: Default - Punch In (new cycle)");
   return (
        <TouchableOpacity style={styles.punchOutBtn} onPress={handlePunchOut}>
          <Icon name="camera-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Punch Out</Text>
        </TouchableOpacity>
      );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.welcomeText}>
        Welcome, {userData?.name || "User"}
      </Text>

      <View style={styles.card}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Punch In:</Text>
          <Text style={styles.timeValue}>{formatTime(punchInTime)}</Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Punch Out:</Text>
          <Text style={styles.timeValue}>{formatTime(punchOutTime)}</Text>
        </View>

 

        {/* Render the attendance button */}
        {renderAttendanceButton()}

      </View>

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
    backgroundColor: "#28a745",
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

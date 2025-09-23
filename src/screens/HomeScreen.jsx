import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { punchInTime, punchOutTime } = useSelector(state => state.permissions);

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Attendance</Text>

      {/* Digital Clock */}
      <View style={styles.clockContainer}>
        <Text style={styles.clockText}>{currentTime}</Text>
      </View>

      {/* Punch In/Out Status */}
      <View style={styles.card}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Punch In</Text>
          <Text style={styles.timeValue}>{punchInTime || "--:--"}</Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Punch Out</Text>
          <Text style={styles.timeValue}>{punchOutTime || "--:--"}</Text>
        </View>
      </View>

      {/* Punch Buttons */}
      {!punchInTime && (
        <TouchableOpacity
          style={styles.punchInBtn}
          onPress={() => navigation.navigate("CameraScreen", { type: "punch_in" })}
        >
          <Text style={styles.btnText}>📸 Punch In</Text>
        </TouchableOpacity>
      )}

      {punchInTime && !punchOutTime && (
        <TouchableOpacity
          style={styles.punchOutBtn}
          onPress={() => navigation.navigate("CameraScreen", { type: "punch_out" })}
        >
          <Text style={styles.btnText}>📸 Punch Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fd", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },

  clockContainer: {
    backgroundColor: "#1e90ff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  clockText: { fontSize: 40, fontWeight: "bold", color: "#fff" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  timeLabel: { fontSize: 18, fontWeight: "600", color: "#444" },
  timeValue: { fontSize: 18, fontWeight: "bold", color: "#1e90ff" },

  punchInBtn: {
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  punchOutBtn: {
    backgroundColor: "#ff4500",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
});

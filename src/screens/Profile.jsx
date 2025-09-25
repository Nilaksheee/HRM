import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { getuserProfile } from "../api/attendenceApi"; 

const Profile = () => {
  const [userData, setUserData] = useState(null);   // ✅ state for user data
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2c6fff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Name:</Text>
          <Text style={styles.cardValue}>{userData.name || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Email:</Text>
          <Text style={styles.cardValue}>{userData.email || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Phone:</Text>
          <Text style={styles.cardValue}>{userData.phone || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Position:</Text>
          <Text style={styles.cardValue}>{userData.position || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Employee ID:</Text>
          <Text style={styles.cardValue}>{userData.employeeId || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Location:</Text>
          <Text style={styles.cardValue}>{userData.workLocation || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Website:</Text>
          <Text style={styles.cardValue}>{userData.website || "N/A"}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9ff", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c6fff",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    marginBottom: 25,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardLabel: { fontWeight: "600", fontSize: 16, color: "#333" },
  cardValue: { fontSize: 16, color: "#000", maxWidth: "65%", textAlign: "right" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9ff" },
  errorText: { fontSize: 18, color: "#ff4d4d", fontWeight: "bold" },
});

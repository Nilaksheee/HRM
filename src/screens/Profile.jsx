import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
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
          <Text style={styles.cardValue}>{user.name || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Email:</Text>
          <Text style={styles.cardValue}>{user.email || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Phone:</Text>
          <Text style={styles.cardValue}>{user.phone || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Position:</Text>
          <Text style={styles.cardValue}>{user.position || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Employee ID:</Text>
          <Text style={styles.cardValue}>{user.employeeId || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Location:</Text>
          <Text style={styles.cardValue}>{user.workLocation || "N/A"}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Website:</Text>
          <Text style={styles.cardValue}>{user.website || "N/A"}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#00f0ff", marginBottom: 20, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, elevation: 6, marginBottom: 25 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  cardLabel: { fontWeight: "bold", fontSize: 16, color: "#00f0ff" },
  cardValue: { fontSize: 16, color: "#fff", maxWidth: "65%", textAlign: "right" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  errorText: { fontSize: 18, color: "#ff4d4d", fontWeight: "bold" },
});

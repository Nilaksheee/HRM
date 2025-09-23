// Profile.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import attendenceApi from "../api/attendenceApi"; // 👈 your API file
import { setCredentials } from "../redux/store"; // 👈 your slice export

const Profile = () => {
  const dispatch = useDispatch();
  const { user, access } = useSelector((state) => state.auth); // 👈 access = token
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user && access) {
        try {
          setLoading(true);
          const response = await attendApi.getProfile(access); // 👈 call your API
          if (response.success) {
            dispatch(
              setCredentials({
                user: response.user, // API should return full user object
                access,
                refresh: null, // if you also keep refresh token
              })
            );
          }
        } catch (err) {
          console.log("Profile fetch failed:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user, access]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00f0ff" />
      </View>
    );
  }

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
          <Text style={styles.cardValue}>{user.name}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Email:</Text>
          <Text style={styles.cardValue}>{user.email}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Phone:</Text>
          <Text style={styles.cardValue}>{user.phone}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Position:</Text>
          <Text style={styles.cardValue}>{user.position}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Employee ID:</Text>
          <Text style={styles.cardValue}>{user.employeeId}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Location:</Text>
          <Text style={styles.cardValue}>{user.workLocation}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Website:</Text>
          <Text style={styles.cardValue}>{user.website}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00f0ff",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    marginBottom: 25,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#00f0ff",
  },
  cardValue: {
    fontSize: 16,
    color: "#fff",
    maxWidth: "65%",
    textAlign: "right",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    fontSize: 18,
    color: "#ff4d4d",
    fontWeight: "bold",
  },
});

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StudentDashboard({ route, navigation }) {
  const [user, setUser] = useState(null);
  const courses = [
    { name: "Math 10111", description: "Introduction to Math" },
    { name: "Science 102", description: "Basic Science" },
    { name: "History 101", description: "World History" },
  ];

  useEffect(() => {
    const loadSession = async () => {
      const sessionData = await AsyncStorage.getItem("userSession");
      if (sessionData) {
        setUser(JSON.parse(sessionData));
      } else {
        navigation.navigate("Login");
      }
    };
    loadSession();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}!</Text>
      <Text style={styles.subtitle}>Your Enrolled Courses</Text>
      <ScrollView style={styles.courseList}>
        {courses.map((course, index) => (
          <View key={index} style={styles.courseCard}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.courseDescription}>{course.description}</Text>
            <Button title="View Assignments" onPress={() => {}} />
          </View>
        ))}
      </ScrollView>
      <Button title="View Completed Tasks" onPress={() => {}} color="#4CAF50" />
      <Button title="View Notifications" onPress={() => {}} color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  courseList: {
    marginBottom: 20,
  },
  courseCard: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  courseDescription: {
    fontSize: 16,
    color: "#555",
  },
});

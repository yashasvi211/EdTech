import React from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";

export default function TeacherDashboard() {
  const courses = [
    { name: "Math 101", description: "Introduction to Math" },
    { name: "Science 102", description: "Basic Science" },
    { name: "History 101", description: "World History" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Teacher!</Text>
      <Text style={styles.subtitle}>Your Courses</Text>
      <ScrollView style={styles.courseList}>
        {courses.map((course, index) => (
          <View key={index} style={styles.courseCard}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.courseDescription}>{course.description}</Text>
            <Button title="Manage Students" onPress={() => {}} />
          </View>
        ))}
      </ScrollView>
      <Button title="Create Post" onPress={() => {}} color="#4CAF50" />
      <Button
        title="View Course Statistics"
        onPress={() => {}}
        color="#4CAF50"
      />
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

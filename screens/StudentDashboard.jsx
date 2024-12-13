import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, Title, Paragraph } from "react-native-paper"; // Material UI Components

export default function StudentDashboard({ route, navigation }) {
  const [user, setUser] = useState(null);
  const courses = [
    { name: "Math 10111", description: "Introduction to Math" },
    { name: "Science 102", description: "Basic Science" },
    { name: "History 101", description: "World History" },
    { name: "History 102", description: "Advanced History" },
    { name: "Geography 101", description: "Introduction to Geography" },
    { name: "Computer Science 101", description: "Intro to CS" },
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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome, {user.name}!</Text>
        <Text style={styles.subtitle}>Your Enrolled Courses</Text>
        {courses.map((course, index) => (
          <Card key={index} style={styles.courseCard}>
            <Card.Content>
              <Title>{course.name}</Title>
              <Paragraph>{course.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => {}}>
                View Assignments
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Extra space to avoid content being cut off at the bottom
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
  courseCard: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

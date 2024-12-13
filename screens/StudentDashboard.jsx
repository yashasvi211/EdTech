import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, Title, Paragraph } from "react-native-paper";

export default function StudentDashboard({ route, navigation }) {
  const [user, setUser] = useState(null);
  const courses = [
    {
      name: "Math 101",
      description: "Introduction to Math",
      syllabus: "Math syllabus content...",
    },
    {
      name: "Science 102",
      description: "Basic Science",
      syllabus: "Science syllabus content...",
    },
    {
      name: "History 101",
      description: "World History",
      syllabus: "History syllabus content...",
    },
    {
      name: "History 102",
      description: "Advanced History",
      syllabus: "Advanced History syllabus content...",
    },
    {
      name: "Geography 101",
      description: "Introduction to Geography",
      syllabus: "Geography syllabus content...",
    },
    {
      name: "Computer Science 101",
      description: "Intro to CS",
      syllabus: "CS syllabus content...",
    },
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

    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    loadSession();

    return () => backHandler.remove(); // Cleanup
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userSession");
    navigation.replace("Login"); // Replace stack to prevent back navigation
  };

  const viewSyllabus = (syllabus) => {
    Alert.alert("Syllabus", syllabus);
  };

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
              <Button
                mode="outlined"
                onPress={() => viewSyllabus(course.syllabus)}
                style={styles.syllabusButton}
              >
                View Syllabus
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
    paddingBottom: 100,
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
  syllabusButton: {
    marginLeft: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#FF5252",
  },
});

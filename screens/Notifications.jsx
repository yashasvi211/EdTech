import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Notifications() {
  // Mock notifications data
  const notifications = [
    { id: "1", message: "Your assignment 'Math Homework' is due tomorrow!" },
    { id: "2", message: "You have a new message from your professor." },
    {
      id: "3",
      message: "The syllabus for 'Science Project' has been updated.",
    },
    { id: "4", message: "Your 'English Essay' has been graded." },
    { id: "5", message: "New announcements posted for 'History Assignment'." },
    {
      id: "6",
      message: "Don't forget to submit your 'Art Project' by Friday.",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <Text>{notification.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

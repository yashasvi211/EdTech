import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student data from the API
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://192.168.29.144:3000/students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student List</Text>
      {students.length === 0 ? (
        <Text style={styles.noDataText}>No students found</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentItem}>
              <Text style={styles.studentName}>{item.name}</Text>
            </View>
          )}
        />
      )}
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
    textAlign: "center",
    marginBottom: 20,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
  },
  studentItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "500",
  },
});

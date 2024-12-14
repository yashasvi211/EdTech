import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import {
  Button as PaperButton,
  Card,
  TextInput as PaperInput,
} from "react-native-paper";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAssignments, setStudentAssignments] = useState(null);

  useEffect(() => {
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

  const fetchStudentAssignments = async (studentId) => {
    try {
      const response = await fetch(
        `http://192.168.29.144:3000/student-assignments/${studentId}`
      );
      const data = await response.json();
      setStudentAssignments(data);
    } catch (error) {
      console.error("Error fetching student assignments:", error);
      setStudentAssignments(null);
    }
  };

  const handleStudentPress = (student) => {
    setSelectedStudent(student);
    fetchStudentAssignments(student.id);
  };

  const renderStudentAssignmentModal = () => {
    if (!selectedStudent || !studentAssignments) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedStudent}
        onRequestClose={() => setSelectedStudent(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedStudent.name}'s Assignments
            </Text>
            <Text style={styles.assignmentSummary}>
              Total Assignments: {studentAssignments.totalAssignments}
            </Text>
            <Text style={styles.assignmentSummary}>
              Submitted Assignments: {studentAssignments.submittedAssignments}
            </Text>
            <Text style={styles.assignmentSummary}>
              Pending Assignments: {studentAssignments.pendingAssignments}
            </Text>
            <PaperButton
              mode="contained"
              onPress={() => setSelectedStudent(null)}
              style={styles.closeButton}
            >
              Close
            </PaperButton>
          </View>
        </View>
      </Modal>
    );
  };

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
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {students.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.studentItem}
              onPress={() => handleStudentPress(student)}
            >
              <Card style={styles.card}>
                <Text style={styles.studentName}>{student.name}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {renderStudentAssignmentModal()}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  assignmentSummary: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
});

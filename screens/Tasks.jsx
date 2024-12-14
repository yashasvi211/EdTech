import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeSection, setActiveSection] = useState("my");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for tasks
  const mockTasks = [
    {
      id: "1",
      name: "Math Homework",
      deadline: "2024-12-20T00:00:00Z",
      completed: false,
    },
    {
      id: "2",
      name: "Science Project",
      deadline: "2024-12-18T00:00:00Z",
      completed: false,
    },
    {
      id: "3",
      name: "English Essay",
      deadline: "2024-12-15T00:00:00Z",
      completed: true,
    },
    {
      id: "4",
      name: "History Assignment",
      deadline: "2024-12-10T00:00:00Z",
      completed: true,
    },
    {
      id: "5",
      name: "Computer Science Lab Report",
      deadline: "2024-12-25T00:00:00Z",
      completed: false,
    },
    {
      id: "6",
      name: "Art Project",
      deadline: "2024-12-16T00:00:00Z",
      completed: false,
    },
    {
      id: "7",
      name: "Geography Assignment",
      deadline: "2024-12-12T00:00:00Z",
      completed: false,
    },
    {
      id: "8",
      name: "Literature Review",
      deadline: "2024-12-21T00:00:00Z",
      completed: false,
    },
    {
      id: "9",
      name: "Chemistry Experiment Report",
      deadline: "2024-12-22T00:00:00Z",
      completed: true,
    },
    {
      id: "10",
      name: "Physics Assignment",
      deadline: "2024-12-14T00:00:00Z",
      completed: true,
    },
  ];

  // Fetch tasks (mocked)
  const fetchTasks = async () => {
    setIsRefreshing(true); // Set refreshing state to true
    try {
      // Here we just set the mock data
      setTasks(mockTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]); // Default to empty array on error
      Alert.alert("Error", "Unable to fetch tasks.");
    } finally {
      setIsRefreshing(false); // Reset refreshing state
    }
  };

  useEffect(() => {
    fetchTasks(); // Call fetch tasks on component mount
  }, []);

  const markAsCompleted = async (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
    Alert.alert("Success", "Task marked as completed!");
  };

  const markAsUndone = async (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: false } : task
      )
    );
    Alert.alert("Success", "Task marked as undone!");
  };

  const renderTask = (task) => {
    const deadlineDate = new Date(task.deadline);
    const formattedDeadline = deadlineDate.toLocaleDateString("en-GB");

    let taskStyle = styles.pendingTask;
    if (task.completed) {
      taskStyle = styles.completedTask;
    } else if (new Date(task.deadline) < new Date()) {
      taskStyle = styles.dueTask;
    }

    return (
      <View style={[styles.taskCard, taskStyle]}>
        <Text style={styles.taskName}>{task.name}</Text>
        <Text style={styles.taskDeadline}>Deadline: {formattedDeadline}</Text>
        {!task.completed ? (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => markAsCompleted(task.id)}
          >
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => markAsUndone(task.id)}
          >
            <Text style={styles.completeButtonText}>Mark as Undone</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const myTasks = tasks.filter(
    (task) => !task.completed && new Date(task.deadline) >= new Date()
  );
  const pendingTasks = tasks.filter(
    (task) => !task.completed && new Date(task.deadline) < new Date()
  );
  const completedTasks = tasks.filter((task) => task.completed);

  const handleSectionToggle = (section) => {
    if (section === "pending" && activeSection === "pending") {
      setActiveSection("my");
    } else if (section === "completed" && activeSection === "completed") {
      setActiveSection("my");
    } else {
      setActiveSection(section);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      {/* Show My Tasks by default */}
      {activeSection === "my" && (
        <>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          {myTasks.length > 0 ? (
            <FlatList
              data={myTasks}
              renderItem={({ item }) => renderTask(item)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={fetchTasks}
                />
              }
            />
          ) : (
            <Text style={styles.noTasksText}>No tasks available.</Text>
          )}
        </>
      )}

      {/* Toggle for Pending Section */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => handleSectionToggle("pending")}
      >
        <Text style={styles.toggleButtonText}>
          {activeSection === "pending" ? "Hide" : "Show"} Pending Tasks
        </Text>
        <Ionicons
          name={activeSection === "pending" ? "chevron-up" : "chevron-down"}
          size={20}
        />
      </TouchableOpacity>

      {activeSection === "pending" && (
        <>
          <Text style={styles.sectionTitle}>Pending Tasks</Text>
          {pendingTasks.length > 0 ? (
            <FlatList
              data={pendingTasks}
              renderItem={({ item }) => renderTask(item)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={fetchTasks}
                />
              }
            />
          ) : (
            <Text style={styles.noTasksText}>No pending tasks.</Text>
          )}
        </>
      )}

      {/* Toggle for Completed Section */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => handleSectionToggle("completed")}
      >
        <Text style={styles.toggleButtonText}>
          {activeSection === "completed" ? "Hide" : "Show"} Completed Tasks
        </Text>
        <Ionicons
          name={activeSection === "completed" ? "chevron-up" : "chevron-down"}
          size={20}
        />
      </TouchableOpacity>

      {activeSection === "completed" && (
        <>
          <Text style={styles.sectionTitle}>Completed Tasks</Text>
          {completedTasks.length > 0 ? (
            <FlatList
              data={completedTasks}
              renderItem={({ item }) => renderTask(item)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={fetchTasks}
                />
              }
            />
          ) : (
            <Text style={styles.noTasksText}>No completed tasks.</Text>
          )}
        </>
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  noTasksText: {
    fontSize: 16,
    color: "#828282",
    textAlign: "center",
  },
  taskCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  pendingTask: {
    backgroundColor: "#ffb74d", // Orange for pending tasks
  },
  completedTask: {
    backgroundColor: "#81c784", // Green for completed tasks
  },
  dueTask: {
    backgroundColor: "#e57373", // Red for overdue tasks
  },
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskDeadline: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

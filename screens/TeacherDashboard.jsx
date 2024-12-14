import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function TeacherDashboard({ navigation }) {
  const [user, setUser] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    submitted: 0,
    notSubmitted: 0,
  });

  useEffect(() => {
    const loadSession = async () => {
      const sessionData = await AsyncStorage.getItem("userSession");
      if (sessionData) {
        setUser(JSON.parse(sessionData));
      } else {
        navigation.navigate("Login");
      }
    };

    const fetchSubmissionData = async () => {
      try {
        const response = await fetch(
          "http://192.168.29.144:3000/assignment_submissions"
        );
        const data = await response.json();

        const submittedCount = data.filter(
          (record) => record.submitted_at !== null
        ).length;
        const totalSubmissionsExpected = data.length;
        const notSubmittedCount = totalSubmissionsExpected - submittedCount;

        // Ensure we always have a valid number
        setSubmissionData({
          submitted: submittedCount || 0,
          notSubmitted: notSubmittedCount || 0,
        });
      } catch (error) {
        console.error("Error fetching submission data:", error);
        // Fallback to 0 if there's an error
        setSubmissionData({ submitted: 0, notSubmitted: 0 });
      }
    };

    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
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
    fetchSubmissionData();

    return () => backHandler.remove();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userSession");
    navigation.replace("Login");
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>User not found</Text>
      </View>
    );
  }

  // Prepare chart data, ensuring we only show non-zero values
  const chartData = [
    {
      name: "Submitted",
      population: submissionData.submitted,
      color: "#2ecc71",
      legendFontColor: "#000",
      legendFontSize: 13,
    },
    {
      name: "Not Submitted",
      population: submissionData.notSubmitted,
      color: "#e74c3c",
      legendFontColor: "#000",
      legendFontSize: 13,
    },
  ].filter((item) => item.population > 0);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome, {user.name}!</Text>
        <Text style={styles.subtitle}>Dashboard Overview</Text>

        {/* Submission Status Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Submission Status</Text>
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={200}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          ) : (
            <Text style={styles.noDataText}>No submission data available</Text>
          )}
        </View>

        {/* Management Options */}
        <Text style={styles.subtitle}>Manage</Text>
        <View style={styles.managementContainer}>
          <View style={styles.row}>
            <Button
              mode="contained"
              style={styles.managementBox}
              onPress={() => navigation.navigate("ManageStudents")}
            >
              Students
            </Button>
            <Button
              mode="contained"
              style={styles.managementBox}
              onPress={() => navigation.navigate("ManageCourses")}
            >
              Courses
            </Button>
          </View>
          <View style={styles.row}>
            <Button
              mode="contained"
              style={styles.managementBox}
              onPress={() => navigation.navigate("ManageAssignments")}
            >
              Assignments
            </Button>
            <Button
              mode="contained"
              style={styles.managementBox}
              onPress={() => navigation.navigate("Tasks")}
            >
              Tasks
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

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
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
  },
  managementContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  managementBox: {
    flex: 1,
    margin: 5,
    justifyContent: "center",
    height: 100,
    borderRadius: 10,
    backgroundColor: "#6200ee",
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Notifications() {
  return (
    <View style={styles.container}>
      9<Text style={styles.title}>Notifications</Text>
      <Text>You will see your notifications here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

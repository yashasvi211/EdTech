import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Tasks() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <Text>You will see your tasks here.</Text>
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

import React from "react";
import { View, StyleSheet } from "react-native";
import { AudioLines } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { colors } from "../constants/colors";

export const AudioWaveButton = () => {
  return (
    <View style={styles.container}>
      <BlurView intensity={50} style={styles.blur} tint="dark">
        <AudioLines color={colors.text.light} size={20} />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  blur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card.darkGlass,
  },
});

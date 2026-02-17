import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function PulsingHeart({ size = 20, color }: { size?: number; color: string }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Feather name="heart" size={size} color={color} />
    </Animated.View>
  );
}
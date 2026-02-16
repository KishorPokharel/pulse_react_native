import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function PostCardSkeleton() {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  const SkeletonBox = ({
    width,
    height,
    style,
  }: {
    width: number | string;
    height: number;
    style?: any;
  }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.text,
          opacity: opacity,
          borderRadius: 4,
        },
        style,
      ]}
    />
  );

  return (
    <View style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {/* Avatar */}
          <SkeletonBox width={40} height={40} style={{ borderRadius: 20 }} />
          <View>
            {/* Author name */}
            <SkeletonBox width={120} height={14} style={{ marginBottom: 4 }} />
            {/* Date */}
            <SkeletonBox width={80} height={10} />
          </View>
        </View>
        {/* Menu icon */}
        <SkeletonBox width={20} height={20} />
      </View>

      {/* Content */}
      <View style={{ marginBlockStart: 10, gap: 8 }}>
        <SkeletonBox width="100%" height={16} />
        <SkeletonBox width="100%" height={16} />
        <SkeletonBox width="90%" height={16} />
        <SkeletonBox width="85%" height={16} />
      </View>

      {/* Action buttons */}
      <View
        style={{
          flexDirection: "row",
          gap: 18,
          paddingBlockStart: 16,
        }}
      >
        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          <SkeletonBox width={20} height={20} />
          <SkeletonBox width={30} height={16} />
        </View>
        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          <SkeletonBox width={20} height={20} />
          <SkeletonBox width={30} height={16} />
        </View>
        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          <SkeletonBox width={20} height={20} />
          <SkeletonBox width={45} height={16} />
        </View>
      </View>
    </View>
  );
}

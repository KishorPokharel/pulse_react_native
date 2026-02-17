import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function SpinningHeart({ 
  size = 20, 
  color, 
  isSpinning 
}: { 
  size?: number; 
  color: string;
  isSpinning: boolean;
}) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isSpinning) {
      // Start infinite loop
      animationRef.current = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animationRef.current.start();
    } else {
      // Stop the loop
      animationRef.current?.stop();
      
      // Get current rotation value
      const currentValue = (spinValue as any)._value;
      
      // Calculate how much more to rotate to complete the cycle
      const remaining = 1 - currentValue;
      
      // Animate to complete the full rotation
      Animated.timing(spinValue, {
        toValue: 1,
        duration: remaining * 1000, // Proportional to remaining rotation
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        // Reset to 0 after completing the rotation
        spinValue.setValue(0);
      });
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [isSpinning]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Feather name="heart" size={size} color={color} />
    </Animated.View>
  );
}
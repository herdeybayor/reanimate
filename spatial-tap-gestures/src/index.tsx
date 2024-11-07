import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const CIRCLE_RADIUS = 30;

const App = () => {
  const left = useSharedValue(0);
  const top = useSharedValue(0);
  const scale = useSharedValue(0);

  const tapGesture = Gesture.Tap().onEnd(event => {
    left.value = event.x - CIRCLE_RADIUS;
    top.value = event.y - CIRCLE_RADIUS;
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      left: left.value,
      top: top.value,
      transform: [{ scale: scale.value }],
    };
  }, []);

  useAnimatedReaction(
    () => {
      return left.value;
    },
    (curr, prev) => {
      if (prev && curr !== prev) {
        cancelAnimation(scale);
        scale.value = 0;
        scale.value = withSpring(1);
      }
    },
    [left],
  );
  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={styles.container}>
        <StatusBar style="light" />
        <Animated.View style={[styles.baseCircle, rStyle]} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  baseCircle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    backgroundColor: '#2f2f2f',
    position: 'absolute',
  },
});

export { App };

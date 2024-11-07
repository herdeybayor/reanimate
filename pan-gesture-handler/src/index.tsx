import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SQUARE_SIZE = 120;

const App = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = translationX + context.value.x;
      translateY.value = translationY + context.value.y;
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  const rotate = useDerivedValue(() => {
    return withSpring(isDragging.value ? '45deg' : '0deg');
  }, [isDragging]);

  const scale = useDerivedValue(() => {
    return withTiming(isDragging.value ? 0.9 : 1);
  }, [isDragging]);

  const color = useDerivedValue(() => {
    if (isDragging.value) {
      return '#0099ff';
    }

    const isInTheWhiteArea = translateY.value < 0;
    const isInTheBlackArea = translateY.value > 0;

    if (isInTheWhiteArea) {
      return '#000';
    }

    if (isInTheBlackArea) {
      return '#fff';
    }

    return '#0099ff';
  }, [isDragging]);

  const animatedColor = useDerivedValue(() => {
    return withTiming(color.value);
  }, [color]);

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedColor.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: rotate.value },
      ],
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.square, rStyle]} />
      </GestureDetector>
      <View style={styles.background} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 30,
    borderCurve: 'continuous',
  },
  background: {
    position: 'absolute',
    top: '50%',
    left: 0,
    height: '50%',
    width: '100%',
    backgroundColor: '#000',
    zIndex: -1,
  },
});

export { App };

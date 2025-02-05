import {
  Dimensions,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  type SharedValue,
} from 'react-native-reanimated';

import { Images } from './constants';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const LIST_IMAGE_WIDTH = WINDOW_WIDTH * 0.8;

const ITEM_INTERNAL_PADDING = 10;
const ITEM_CONTAINER_WIDTH = LIST_IMAGE_WIDTH + ITEM_INTERNAL_PADDING * 2;

const LIST_PADDING = (WINDOW_WIDTH - ITEM_CONTAINER_WIDTH) / 2;

interface ListImageProps {
  uri: string;
  imageWidth: number;
  itemWidth: number;
  imageContainerStyle?: StyleProp<ViewStyle>;
  scrollOffset: SharedValue<number>;
  index: number;
}

const ListImage: React.FC<ListImageProps> = ({
  uri,
  imageWidth,
  itemWidth,
  imageContainerStyle,
  scrollOffset,
  index,
}) => {
  const rImageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollOffset.value,
      [itemWidth * (index - 1), itemWidth * index, itemWidth * (index + 1)],
      [-WINDOW_WIDTH / 2, 0, WINDOW_WIDTH / 2],
    );
    return {
      transform: [{ scale: 1.7 }, { translateX }],
    };
  }, [scrollOffset]);

  const rContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollOffset.value,
      [itemWidth * (index - 1), itemWidth * index, itemWidth * (index + 1)],
      [1, 1.05, 1],
    );
    return {
      transform: [{ scale }],
    };
  });
  return (
    <Animated.View
      style={[
        imageContainerStyle,
        { overflow: 'hidden', borderRadius: 20 },
        rContainerStyle,
      ]}>
      <Animated.Image
        source={{ uri }}
        resizeMode="cover"
        style={[
          {
            width: imageWidth,
            aspectRatio: 0.6,
          },
          rImageStyle,
        ]}
      />
    </Animated.View>
  );
};

const App = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  useAnimatedReaction(
    () => scrollOffset.value,
    offset => {
      console.log('offset', offset);
    },
  );
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: 'center',
          paddingLeft: LIST_PADDING,
          paddingRight: LIST_PADDING,
        }}
        snapToInterval={ITEM_CONTAINER_WIDTH}
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}>
        {Images.map((image, index) => (
          <ListImage
            key={index}
            index={index}
            uri={image}
            scrollOffset={scrollOffset}
            imageWidth={LIST_IMAGE_WIDTH}
            itemWidth={ITEM_CONTAINER_WIDTH}
            imageContainerStyle={{
              marginHorizontal: ITEM_INTERNAL_PADDING,
            }}
          />
        ))}
      </Animated.ScrollView>
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
});

export { App };

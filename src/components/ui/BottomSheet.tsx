import { PropsWithChildren } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type BottomSheetProps = {
  isOpen: SharedValue<boolean>;
  onPress: () => void;
  duration?: number;
};

export function BottomSheet({
  children,
  isOpen,
  onPress,
  duration = 500,
}: PropsWithChildren<BottomSheetProps>) {
  const height = useSharedValue(0);

  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    // duration 0 to avoid app crashes when zIndex changes with closing animation
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        // initial height: 500

        // progress 0 | height 0
        // progress 0.25 | height 125
        // progress 0.5 | height 250
        // progress 0.75 | height 375
        // progress 1 | height 500
        translateY: height.value * progress.value,
      },
    ],
    zIndex: 2,
  }));

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress} />
      </Animated.View>
      <Animated.View
        style={[styles.sheet, sheetAnimatedStyle]}
        onLayout={event => (height.value = event.nativeEvent.layout.height)}
      >
        {children}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});

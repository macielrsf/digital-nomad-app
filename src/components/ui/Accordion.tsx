import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { Box } from './Box';
import theme from '@/src/theme/theme';
import Animated, {
  useSharedValue,
  SharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';

type Props = {
  title: string;
  description: string;
};

export function Accordion({ title, description }: Props) {
  const isOpen = useSharedValue(false);
  const progress = useSharedValue(0);

  function handleToggle() {
    isOpen.value = !isOpen.value;
    progress.value = withTiming(isOpen.value ? 1 : 0, { duration: 500 });
  }

  return (
    <Pressable onPress={handleToggle}>
      <View>
        <AccordionHeader title={title} progress={progress} />
        <AccordionContent
          description={description}
          isOpen={isOpen}
          progress={progress}
        />
      </View>
    </Pressable>
  );
}

function AccordionHeader({
  title,
  progress,
}: {
  title: string;
  progress: SharedValue<number>;
}) {
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    tintColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.gray2, theme.colors.fieryRed]
    ),
    transform: [
      { rotate: interpolate(progress.value, [0, 1], [0, 180]) + 'deg' },
    ],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.midnightBlack, theme.colors.gray1]
    ),
    borderBottomLeftRadius: interpolate(
      progress.value,
      [0, 1],
      [theme.borderRadii.default, 0]
    ),
    borderBottomRightRadius: interpolate(
      progress.value,
      [0, 1],
      [theme.borderRadii.default, 0]
    ),
  }));

  return (
    <Animated.View style={[styles.header, headerAnimatedStyle]}>
      <Box flexShrink={1}>
        <Text variant='title16'>{title}</Text>
      </Box>
      <Animated.Image
        source={require('@/assets/images/chevron-down.png')}
        style={[styles.chevronDownStyle, iconAnimatedStyle]}
      />
    </Animated.View>
  );
}

function AccordionContent({
  description,
  isOpen,
  progress,
}: {
  description: string;
  isOpen: SharedValue<boolean>;
  progress: SharedValue<number>;
}) {
  const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(progress.value, [0, 1], [0, height.value]),
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      borderTopLeftRadius: interpolate(
        progress.value,
        [0, 1],
        [theme.borderRadii.default, 0]
      ),
      borderTopRightRadius: interpolate(
        progress.value,
        [0, 1],
        [theme.borderRadii.default, 0]
      ),
    };
  });

  return (
    <Animated.View style={[animatedStyle, { overflow: 'hidden' }]}>
      <View
        style={styles.content}
        onLayout={event => {
          height.value = event.nativeEvent.layout.height;
        }}
      >
        <Text>{description}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.gray1,
    borderRadius: theme.borderRadii.default,
    paddingHorizontal: 16,
  },
  content: {
    position: 'absolute',
    paddingBottom: 16,
    backgroundColor: theme.colors.gray1,
    paddingHorizontal: 16,
    borderBottomLeftRadius: theme.borderRadii.default,
    borderBottomRightRadius: theme.borderRadii.default,
  },
  chevronDownStyle: {
    width: 24,
    height: 24,
  },
});

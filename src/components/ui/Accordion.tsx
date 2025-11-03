import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { Box } from './Box';
import theme from '@/src/theme/theme';
import Animated, {
  useSharedValue,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { use } from 'react';

type Props = {
  title: string;
  description: string;
};

export function Accordion({ title, description }: Props) {
  const isOpen = useSharedValue(false);

  function handleToggle() {
    isOpen.value = !isOpen.value;
  }

  return (
    <Pressable onPress={handleToggle}>
      <View>
        <AccordionHeader title={title} isOpen={isOpen} />
        <AccordionContent description={description} isOpen={isOpen} />
      </View>
    </Pressable>
  );
}

function AccordionHeader({
  title,
  isOpen,
}: {
  title: string;
  isOpen: SharedValue<boolean>;
}) {
  return (
    <View style={isOpen.value ? styles.headerOpened : styles.header}>
      <Box flexShrink={1}>
        <Text variant='title16'>{title}</Text>
      </Box>
      <Icon
        name={isOpen.value ? 'Chevron-up' : 'Chevron-down'}
        color={isOpen.value ? 'primary' : 'gray2'}
        size={24}
      />
    </View>
  );
}

function AccordionContent({
  description,
  isOpen,
}: {
  description: string;
  isOpen: SharedValue<boolean>;
}) {
  const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isOpen.value ? height.value : 0, { duration: 500 }),
    };
  });

  return (
    <Animated.View style={[animatedStyle, { overflow: 'hidden' }]}>
      <View
        style={styles.content}
        onLayout={event => (height.value = event.nativeEvent.layout.height)}
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
  headerOpened: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.gray1,
    backgroundColor: theme.colors.gray1,
    borderTopLeftRadius: theme.borderRadii.default,
    borderTopRightRadius: theme.borderRadii.default,
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
});

import { Pressable, PressableProps } from 'react-native';
import { Box, BoxProps } from './Box';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

export type BadgeProps = {
  label: string;
  iconName: IconName;
  active: boolean;
  onPress?: PressableProps['onPress'];
};

/**
 * The height of the Badge component in pixels is the sum of the icon size, padding, and border width.
 * Icon size: 16px
 * Vertical padding: 8px (top) + 8px (bottom) = 16px
 * Border width: 2px (top) + 2px (bottom) = 4px
 * Total height = 16px + 16px + 4px = 36px
 */
export const BadgeHeight = 36;

export function Badge({
  label,
  iconName,
  active,
  onPress,
  ...boxProps
}: BadgeProps) {
  return (
    <Pressable onPress={onPress}>
      <Box
        {...boxStyle}
        {...boxProps}
        backgroundColor={active ? 'gray1' : 'transparent'}
      >
        <Icon name={iconName} size={16} color={active ? 'primary' : 'gray2'} />
        <Text variant='text12' ml='s4'>
          {label}
        </Text>
      </Box>
    </Pressable>
  );
}

const boxStyle: BoxProps = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 's8',
  padding: 's8',
  borderRadius: 'rounded',
  borderColor: 'gray1',
  borderWidth: 2,
};

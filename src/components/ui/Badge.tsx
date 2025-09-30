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

import { Box, BoxProps } from './Box';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

export type BadgeProps = {
  label: string;
  iconName: IconName;
  active: boolean;
};

export function Badge({ label, iconName, active, ...boxProps }: BadgeProps) {
  return (
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

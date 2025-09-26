import { Pressable, PressableProps } from 'react-native';
import { Icon, IconName } from './Icon';
import { Box, BoxProps } from './Box';
import { useAppTheme } from '../../theme/useAppTheme';

type IconButtonProps = {
  iconName: IconName;
  onPress: PressableProps['onPress'];
};

export const IconButton = ({ iconName, onPress }: IconButtonProps) => {
  const { boxShadows } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      <Box {...boxStyle} style={{ boxShadow: boxShadows.primary }}>
        <Icon name={iconName} color='pureWhite' />
      </Box>
    </Pressable>
  );
};

const boxStyle: BoxProps = {
  padding: 's12',
  backgroundColor: 'primary',
  borderRadius: 'rounded',
  alignItems: 'center',
};

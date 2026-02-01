import MapView from 'react-native-maps';
import { useWindowDimensions } from 'react-native';
import { BottomSheet, BottomSheetProps } from '@/src/components/ui/BottomSheet';
import { City } from '@/src/domain/city/City';
import { useAppTheme } from '@/src/theme/useAppTheme';
import { IconButton } from '../ui/IconButton';
import { Box } from '../ui/Box';

type BottomSheetMapProps = Omit<BottomSheetProps, 'children'> & {
  location: Pick<City, 'location'>['location'];
};

export default function BottomSheetMap({
  location,
  ...bottomSheetProps
}: BottomSheetMapProps) {
  const { height } = useWindowDimensions();
  const { borderRadii, spacing } = useAppTheme();

  return (
    <BottomSheet {...bottomSheetProps}>
      <MapView
        style={{
          width: '100%',
          height: height * 0.7,
          borderRadius: borderRadii.default,
        }}
        initialRegion={{
          ...location,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <Box position='absolute' top={spacing.padding} right={spacing.padding}>
        <IconButton iconName='Close' onPress={bottomSheetProps.toggle} />
      </Box>
    </BottomSheet>
  );
}

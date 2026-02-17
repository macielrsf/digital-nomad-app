import { useLocalSearchParams } from 'expo-router';
import { Pressable } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { useCityFindById } from '@/src/domain/city/operations/useCityFindById';
import { Divider } from '@/src/ui/components/Divider';
import { Screen } from '@/src/ui/components/Screen';
import { Text } from '@/src/ui/components/Text';
import BottomSheetMap from '@/src/ui/containers/BottomSheetMap';
import { CityDetailsHeader } from '@/src/ui/containers/CityDetailsHeader';
import { CityDetailsInfo } from '@/src/ui/containers/CityDetailsInfo';
import { CityDetailsMap } from '@/src/ui/containers/CityDetailsMap';
import { CityDetailsRelatedCities } from '@/src/ui/containers/CityDetailsRelatedCities';
import { CityDetailsTouristAttractions } from '@/src/ui/containers/CityDetailsTouristAttractions';

export default function CityDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: city } = useCityFindById(id);

  const bottomSheetIsOpen = useSharedValue(false);

  const toggleBottomSheet = () => {
    bottomSheetIsOpen.value = !bottomSheetIsOpen.value;
  };

  if (!city) {
    return (
      <Screen>
        <Text>City not found</Text>
      </Screen>
    );
  }

  return (
    <>
      <Screen
        style={{ flex: 1, paddingHorizontal: 0 }}
        scrollable
        contentContainerStyle={{ paddingBottom: 32 }}
        header={<CityDetailsHeader city={city} />}
      >
        <CityDetailsInfo
          name={city.name}
          country={city.country}
          description={city.description}
        />
        <CityDetailsTouristAttractions
          touristAttractions={city.touristAttractions}
        />
        <Divider paddingHorizontal='padding' />
        <Pressable onPress={toggleBottomSheet}>
          <CityDetailsMap location={city.location} />
        </Pressable>
        <CityDetailsRelatedCities id={city.id} />
      </Screen>
      <BottomSheetMap
        location={city.location}
        toggle={toggleBottomSheet}
        isOpen={bottomSheetIsOpen}
      />
    </>
  );
}

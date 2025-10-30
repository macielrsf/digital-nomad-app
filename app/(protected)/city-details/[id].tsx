import { useLocalSearchParams } from 'expo-router';

import { useCityDetails } from '@/src/data/useCityDetails';

import { CityDetailsHeader } from '@/src/containers/CityDetailsHeader';
import { CityDetailsInfo } from '@/src/containers/CityDetailsInfo';
import { CityDetailsTouristAttractions } from '@/src/containers/CityDetailsTouristAttractions';
import { CityDetailsMap } from '@/src/containers/CityDetailsMap';
import { CityDetailsRelatedCities } from '@/src/containers/CityDetailsRelatedCities';
import { Screen } from '@/src/components/layout/Screen';
import { Text } from '@/src/components/ui/Text';

export default function CityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const city = useCityDetails(id as string);

  if (!city) {
    return (
      <Screen>
        <Text>City not found</Text>
      </Screen>
    );
  }

  return (
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
      <CityDetailsMap />
      <CityDetailsRelatedCities />
    </Screen>
  );
}

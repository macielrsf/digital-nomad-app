import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function CityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title='Go Back' onPress={() => router.back()} />
      <Text>City Details {id}</Text>
    </View>
  );
}

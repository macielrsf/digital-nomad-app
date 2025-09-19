import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function NotFound() {
  return (
    <View>
      <Text>Not Found</Text>
      <Link href='/'>Go to home screen</Link>
    </View>
  );
}

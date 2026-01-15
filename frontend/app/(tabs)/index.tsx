import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
   const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, Expo Router!</Text>
      <Text style={styles.subtitle}>Fast Refresh Works Here 🚀</Text>
      <Button
        title="Go to Details"
        onPress={() => router.push('/explore')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
});

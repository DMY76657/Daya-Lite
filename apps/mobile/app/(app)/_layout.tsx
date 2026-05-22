import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#047857' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Daya Lite' }} />
      <Stack.Screen name="add-meal" options={{ title: 'Ново ястие', presentation: 'modal' }} />
      <Stack.Screen name="profile" options={{ title: 'Профил' }} />
    </Stack>
  );
}

import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { tokenStorage } from '../lib/storage';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [checked, setChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    tokenStorage.get().then((t) => {
      setHasToken(!!t);
      setChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!checked) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!hasToken && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (hasToken && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [checked, hasToken, segments, router]);

  if (!checked) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

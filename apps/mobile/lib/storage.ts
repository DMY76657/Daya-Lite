import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'daya_token';
const USER_KEY = 'daya_user';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// SecureStore is not implemented on Web; fall back to localStorage there.
async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    window.localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return window.localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function removeItem(key: string) {
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const tokenStorage = {
  get: () => getItem(TOKEN_KEY),
  set: (value: string) => setItem(TOKEN_KEY, value),
  clear: () => removeItem(TOKEN_KEY),
};

export const userStorage = {
  async get(): Promise<StoredUser | null> {
    const raw = await getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  },
  set: (user: StoredUser) => setItem(USER_KEY, JSON.stringify(user)),
  clear: () => removeItem(USER_KEY),
};

export async function clearSession() {
  await Promise.all([removeItem(TOKEN_KEY), removeItem(USER_KEY)]);
}

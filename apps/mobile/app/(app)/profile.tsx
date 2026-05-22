import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { clearSession, userStorage, type StoredUser } from '../../lib/storage';
import { messages } from '../../lib/messages';

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userStorage.get().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  function confirmLogout() {
    if (Platform.OS === 'web') {
      const ok = window.confirm(messages.profile.logoutConfirmMessage);
      if (ok) doLogout();
      return;
    }
    Alert.alert(
      messages.profile.logoutConfirmTitle,
      messages.profile.logoutConfirmMessage,
      [
        { text: messages.profile.cancel, style: 'cancel' },
        { text: messages.profile.logoutBtn, style: 'destructive', onPress: doLogout },
      ],
    );
  }

  async function doLogout() {
    await clearSession();
    router.replace('/(auth)/login');
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#047857" size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Няма налична информация за профила.</Text>
        <TouchableOpacity onPress={doLogout} style={[styles.logoutBtn, { marginTop: 16 }]}>
          <Text style={styles.logoutBtnText}>{messages.profile.logoutBtn}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name.trim().charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.card}>
        <Field label={messages.profile.name} value={user.name} />
        <Divider />
        <Field label={messages.profile.email} value={user.email} />
        <Divider />
        <Field
          label={messages.profile.role}
          value={user.role === 'admin' ? messages.profile.roleAdmin : messages.profile.roleUser}
        />
      </View>

      <TouchableOpacity onPress={confirmLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutBtnText}>{messages.profile.logoutBtn}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5f9' },
  content: { padding: 16, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  muted: { color: '#64748b', fontSize: 15, textAlign: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  avatarText: { color: 'white', fontSize: 32, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '600', color: '#0f172a', marginTop: 12 },
  email: { fontSize: 14, color: '#64748b', marginTop: 4 },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 14,
  },
  field: { paddingVertical: 14 },
  fieldLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  fieldValue: { fontSize: 15, color: '#0f172a', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#e2e8f0' },
  logoutBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  logoutBtnText: { color: 'white', fontWeight: '600', fontSize: 15 },
});

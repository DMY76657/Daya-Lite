import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { api, ApiError } from '../../lib/api';
import { tokenStorage, userStorage, type StoredUser } from '../../lib/storage';
import { messages } from '../../lib/messages';

interface RegisterResponse {
  user: StoredUser;
  token: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    name.trim().length >= 2 && email.includes('@') && password.length >= 8;

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const data = await api<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: { name: name.trim(), email: email.trim(), password },
        auth: false,
      });
      await tokenStorage.set(data.token);
      await userStorage.set(data.user);
      if (Platform.OS === 'web') {
        window.location.href = '/';
      } else {
        router.replace('/(app)');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : messages.errors.network);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.brand}>{messages.appName}</Text>
          <Text style={styles.title}>{messages.auth.registerTitle}</Text>

          <Text style={styles.label}>{messages.auth.name}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={messages.auth.namePlaceholder}
            autoCapitalize="words"
            autoComplete="name"
            style={styles.input}
          />

          <Text style={styles.label}>{messages.auth.email}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.input}
          />

          <Text style={styles.label}>{messages.auth.password}</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password-new"
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              style={styles.toggleBtn}
            >
              <Text style={styles.toggleText}>
                {showPassword ? messages.auth.hidePassword : messages.auth.showPassword}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>{messages.auth.passwordHint}</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            onPress={onSubmit}
            disabled={loading || !canSubmit}
            style={[
              styles.button,
              (loading || !canSubmit) && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {loading ? messages.auth.loading : messages.auth.registerBtn}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{messages.auth.hasAccount} </Text>
            <Link href="/(auth)/login" replace style={styles.link}>
              {messages.auth.title}
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5f9' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  brand: {
    fontSize: 24,
    fontWeight: '600',
    color: '#047857',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 10 },
  toggleText: { color: '#0f766e', fontWeight: '500', fontSize: 13 },
  hint: { fontSize: 12, color: '#64748b', marginTop: 4 },
  error: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: '#94a3b8' },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: { color: '#64748b', fontSize: 14 },
  link: { color: '#047857', fontWeight: '600', fontSize: 14 },
});

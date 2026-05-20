import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import type { Meal, MealLog } from '@daya-lite/shared';
import { api, ApiError } from '../../lib/api';
import { tokenStorage } from '../../lib/storage';
import { messages } from '../../lib/messages';

type LogWithMeal = MealLog & { meal: Meal };
type PlanResponse = (MealLog & { meal: Meal })[];
interface PlanWithLogs {
  id: string;
  planDate: string;
  logs: LogWithMeal[];
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function statusLabel(s: MealLog['status']): string {
  if (s === 'eaten') return messages.today.eaten;
  if (s === 'skipped') return messages.today.skipped;
  return messages.today.planned;
}

function statusColors(s: MealLog['status']): { bg: string; fg: string } {
  if (s === 'eaten') return { bg: '#d1fae5', fg: '#047857' };
  if (s === 'skipped') return { bg: '#e2e8f0', fg: '#475569' };
  return { bg: '#fef3c7', fg: '#b45309' };
}

export default function TodayScreen() {
  const router = useRouter();
  const today = todayIso();
  const [logs, setLogs] = useState<LogWithMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const plan = await api<PlanWithLogs | null>(`/plans/${today}`);
      setLogs(plan?.logs ?? []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : messages.errors.network);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [today]);

  useEffect(() => {
    load();
  }, [load]);

  // Re-fetch when navigating back from "Add meal"
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function markEaten(logId: string) {
    try {
      const updated = await api<LogWithMeal>(`/logs/${logId}/eat`, { method: 'PATCH' });
      setLogs((prev) =>
        prev.map((l) => (l.id === logId ? { ...updated, meal: l.meal } : l)),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : messages.errors.network);
    }
  }

  async function logout() {
    await tokenStorage.clear();
    router.replace('/(auth)/login');
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: messages.today.title,
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>{messages.auth.logout}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.screen}>
        <View style={styles.dateBar}>
          <Text style={styles.date}>{today}</Text>
          <TouchableOpacity
            onPress={() => router.push('/(app)/add-meal')}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>+ {messages.today.addMeal}</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {loading ? (
          <ActivityIndicator style={{ marginTop: 24 }} color="#047857" />
        ) : (
          <FlatList
            data={logs}
            keyExtractor={(l) => l.id}
            contentContainerStyle={logs.length === 0 ? styles.emptyContainer : undefined}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  load();
                }}
                tintColor="#047857"
              />
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{messages.today.noMeals}</Text>
              </View>
            }
            renderItem={({ item }) => {
              const colors = statusColors(item.status);
              return (
                <View style={styles.logCard}>
                  <View style={styles.logHeader}>
                    <Text style={styles.time}>{item.scheduledTime}</Text>
                    <View
                      style={[styles.badge, { backgroundColor: colors.bg }]}
                    >
                      <Text style={[styles.badgeText, { color: colors.fg }]}>
                        {statusLabel(item.status)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.mealName}>{item.meal.name}</Text>
                  {item.meal.calories !== null && (
                    <Text style={styles.calories}>{item.meal.calories} ккал</Text>
                  )}
                  {item.status === 'planned' && (
                    <TouchableOpacity
                      onPress={() => markEaten(item.id)}
                      style={styles.eatBtn}
                    >
                      <Text style={styles.eatBtnText}>
                        ✓ {messages.today.markEaten}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5f9' },
  headerBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  headerBtnText: { color: 'white', fontWeight: '500' },
  dateBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  date: { fontSize: 16, fontWeight: '500', color: '#334155' },
  addBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: 'white', fontWeight: '600', fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  empty: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 15, textAlign: 'center' },
  logCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: { fontSize: 14, fontFamily: 'monospace', color: '#64748b' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  mealName: { fontSize: 16, fontWeight: '500', marginTop: 4, color: '#0f172a' },
  calories: { fontSize: 12, color: '#64748b', marginTop: 2 },
  eatBtn: {
    backgroundColor: '#d1fae5',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  eatBtnText: { color: '#047857', fontWeight: '600', fontSize: 14 },
  error: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
});

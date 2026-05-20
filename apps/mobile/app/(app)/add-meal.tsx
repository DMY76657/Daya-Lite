import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import type { Meal, MealLog, DailyPlan } from '@daya-lite/shared';
import { api, ApiError } from '../../lib/api';
import { messages } from '../../lib/messages';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

export default function AddMealScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [addToPlan, setAddToPlan] = useState(true);
  const [time, setTime] = useState('08:00');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);

    if (!name.trim()) {
      setError('Името е задължително.');
      return;
    }
    if (addToPlan && !TIME_RE.test(time)) {
      setError(messages.errors.timeFormat);
      return;
    }

    setLoading(true);
    try {
      // 1) create meal
      const meal = await api<Meal>('/meals', {
        method: 'POST',
        body: {
          name: name.trim(),
          description: description.trim() || null,
          calories: calories ? Number(calories) : null,
        },
      });

      // 2) optionally add to today's plan
      if (addToPlan) {
        let planId: string;
        try {
          const plan = await api<DailyPlan>('/plans', {
            method: 'POST',
            body: { planDate: todayIso(), notes: null },
          });
          planId = plan.id;
        } catch (e) {
          // 409 means plan for today already exists — fetch it
          if (e instanceof ApiError && e.status === 409) {
            const existing = await api<{ id: string } | null>(`/plans/${todayIso()}`);
            if (!existing) throw e;
            planId = existing.id;
          } else {
            throw e;
          }
        }

        await api<MealLog>('/logs', {
          method: 'POST',
          body: {
            planId,
            mealId: meal.id,
            scheduledTime: time,
            status: 'planned',
          },
        });
      }

      router.back();
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
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>{messages.addMeal.name}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={messages.addMeal.namePlaceholder}
          style={styles.input}
        />

        <Text style={styles.label}>{messages.addMeal.description}</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textarea]}
        />

        <Text style={styles.label}>{messages.addMeal.calories}</Text>
        <TextInput
          value={calories}
          onChangeText={setCalories}
          keyboardType="number-pad"
          style={styles.input}
        />

        <View style={styles.row}>
          <Text style={styles.switchLabel}>{messages.addMeal.addToToday}</Text>
          <Switch
            value={addToPlan}
            onValueChange={setAddToPlan}
            trackColor={{ true: '#10b981', false: '#cbd5e1' }}
          />
        </View>

        {addToPlan && (
          <>
            <Text style={styles.label}>{messages.addMeal.time}</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="08:00"
              maxLength={5}
              style={styles.input}
            />
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading || !name.trim()}
          style={[
            styles.button,
            (loading || !name.trim()) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? messages.auth.loading : messages.addMeal.submit}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5f9' },
  content: { padding: 16 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  switchLabel: { fontSize: 15, color: '#334155' },
  error: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonDisabled: { backgroundColor: '#94a3b8' },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

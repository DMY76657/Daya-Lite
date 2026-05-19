import type { MealLogStatus, ValidationResult } from '@daya-lite/shared';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MealInput {
  name: string;
  description: string | null;
  calories: number | null;
}

export interface PlanInput {
  planDate: string;
  notes: string | null;
}

export interface LogCreateInput {
  planId: string;
  mealId: string;
  scheduledTime: string;
  status: MealLogStatus;
}

export interface LogUpdateInput {
  scheduledTime?: string;
  status?: MealLogStatus;
}

export interface DeleteAccountInput {
  password: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const STATUS_VALUES: readonly MealLogStatus[] = ['planned', 'eaten', 'skipped'];

export function validateRegister(body: unknown): ValidationResult<RegisterInput> {
  const errors: string[] = [];
  const b = (body ?? {}) as Partial<Record<keyof RegisterInput, unknown>>;

  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  const password = typeof b.password === 'string' ? b.password : '';
  const name = typeof b.name === 'string' ? b.name.trim() : '';

  if (!email || !EMAIL_RE.test(email)) errors.push('Невалиден имейл.');
  if (password.length < 8) errors.push('Паролата трябва да е поне 8 символа.');
  if (name.length < 2) errors.push('Името трябва да е поне 2 символа.');

  if (errors.length > 0) return { success: false, errors };
  return { success: true, data: { email, password, name } };
}

export function validateLogin(body: unknown): ValidationResult<LoginInput> {
  const errors: string[] = [];
  const b = (body ?? {}) as Partial<Record<keyof LoginInput, unknown>>;

  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  const password = typeof b.password === 'string' ? b.password : '';

  if (!email) errors.push('Имейлът е задължителен.');
  if (!password) errors.push('Паролата е задължителна.');

  if (errors.length > 0) return { success: false, errors };
  return { success: true, data: { email, password } };
}

export function validateMeal(body: unknown): ValidationResult<MealInput> {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const description =
    typeof b.description === 'string' && b.description.trim().length > 0
      ? b.description.trim()
      : null;

  let calories: number | null = null;
  if (b.calories !== null && b.calories !== undefined && b.calories !== '') {
    const n = Number(b.calories);
    if (!Number.isFinite(n) || n < 0 || n > 100000) {
      errors.push('Калориите трябва да са между 0 и 100000.');
    } else {
      calories = Math.round(n);
    }
  }

  if (name.length < 1 || name.length > 200) {
    errors.push('Името на ястието трябва да е между 1 и 200 символа.');
  }

  if (errors.length > 0) return { success: false, errors };
  return { success: true, data: { name, description, calories } };
}

export function validatePlan(body: unknown): ValidationResult<PlanInput> {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const planDate = typeof b.planDate === 'string' ? b.planDate.trim() : '';
  const notes =
    typeof b.notes === 'string' && b.notes.trim().length > 0 ? b.notes.trim() : null;

  if (!DATE_RE.test(planDate)) {
    errors.push('Датата трябва да е във формат YYYY-MM-DD.');
  }

  if (errors.length > 0) return { success: false, errors };
  return { success: true, data: { planDate, notes } };
}

export function validateLogCreate(body: unknown): ValidationResult<LogCreateInput> {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const planId = typeof b.planId === 'string' ? b.planId : '';
  const mealId = typeof b.mealId === 'string' ? b.mealId : '';
  const scheduledTime = typeof b.scheduledTime === 'string' ? b.scheduledTime : '';
  const status = (typeof b.status === 'string' ? b.status : 'planned') as MealLogStatus;

  if (!planId) errors.push('Липсва plan_id.');
  if (!mealId) errors.push('Липсва meal_id.');
  if (!TIME_RE.test(scheduledTime)) errors.push('Часът трябва да е във формат HH:MM.');
  if (!STATUS_VALUES.includes(status)) errors.push('Невалиден статус.');

  if (errors.length > 0) return { success: false, errors };
  return { success: true, data: { planId, mealId, scheduledTime, status } };
}

export function validateLogUpdate(body: unknown): ValidationResult<LogUpdateInput> {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;
  const result: LogUpdateInput = {};

  if (b.scheduledTime !== undefined) {
    if (typeof b.scheduledTime !== 'string' || !TIME_RE.test(b.scheduledTime)) {
      errors.push('Часът трябва да е във формат HH:MM.');
    } else {
      result.scheduledTime = b.scheduledTime;
    }
  }

  if (b.status !== undefined) {
    if (
      typeof b.status !== 'string' ||
      !STATUS_VALUES.includes(b.status as MealLogStatus)
    ) {
      errors.push('Невалиден статус.');
    } else {
      result.status = b.status as MealLogStatus;
    }
  }

  if (errors.length > 0) return { success: false, errors };
  return { success: true, data: result };
}

export function validateDeleteAccount(body: unknown): ValidationResult<DeleteAccountInput> {
  const b = (body ?? {}) as Record<string, unknown>;
  const password = typeof b.password === 'string' ? b.password : '';
  if (!password) return { success: false, errors: ['Паролата е задължителна.'] };
  return { success: true, data: { password } };
}

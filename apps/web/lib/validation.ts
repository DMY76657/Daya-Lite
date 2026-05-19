import type { ValidationResult } from '@daya-lite/shared';

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

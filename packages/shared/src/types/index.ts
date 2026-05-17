export type UserRole = 'user' | 'admin';
export type MealLogStatus = 'planned' | 'eaten' | 'skipped';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Meal {
  id: string;
  name: string;
  description: string | null;
  calories: number | null;
  userId: string;
  createdAt: Date;
}

export interface DailyPlan {
  id: string;
  userId: string;
  planDate: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealLog {
  id: string;
  planId: string;
  mealId: string;
  scheduledTime: string;
  status: MealLogStatus;
  eatenAt: Date | null;
  createdAt: Date;
}

export interface DailyPlanWithLogs extends DailyPlan {
  logs: (MealLog & { meal: Meal })[];
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export type ApiResponse<T> = { data: T } | { error: string };

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

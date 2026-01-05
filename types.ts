export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  plan: 'Free' | 'Pro' | 'Elite';
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  scope?: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export type MuscleGroup =
  | 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps'
  | 'pernas' | 'panturrilha' | 'abdomen' | 'cardio' | 'outro';

export interface Exercise {
  id: string;
  name: string;
  muscle_group: MuscleGroup | string;
  // UI Aliases
  muscle?: string;
  equipment: string;
  difficulty?: 'iniciante' | 'intermediario' | 'avancado' | string;
  image_url?: string;
  image?: string;
  description?: string;
  instructions?: string[] | { title: string; text: string }[];
  is_custom: boolean;
  user_id?: string;
  created_at?: string;
}

export interface TrainingPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  exercises?: PlanExercise[];
}

export interface PlanExercise {
  id: string;
  plan_id: string;
  exercise_id: string;
  exercise?: Exercise;
  target_sets: number;
  target_reps: string;
  target_weight?: number;
  order: number;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  plan_id?: string;
  start_time: string;
  end_time?: string;
  total_volume: number;
  notes?: string;
  logs?: WorkoutLog[];
}

export interface WorkoutLog {
  id: string;
  session_id: string;
  exercise_id: string;
  exercise?: Exercise;
  notes?: string;
  created_at: string;
  sets: WorkoutSet[];
}

export interface WorkoutSet {
  id: string;
  log_id: string;
  weight: number;
  reps: number;
  rest_seconds: number;
  completed: boolean;
  order: number;
}

export interface UserMetrics {
  id: string;
  user_id: string;
  weight?: number;
  height?: number;
  body_fat?: number;
  chest?: number;
  waist?: number;
  biceps_left?: number;
  biceps_right?: number;
  recorded_at: string;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type?: 'system' | 'workout_reminder' | 'goal_achieved' | 'social' | 'achievement' | 'friend';
  created_at: string;
}

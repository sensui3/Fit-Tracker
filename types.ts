export interface User {
  name: string;
  email: string;
  avatar: string;
  plan: string;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  image: string;
}

export interface WorkoutSet {
  id: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface IYearlyStreakDay {
  date: string;
  attempts: number;
  active: boolean;
}

export interface IYearlyStreak {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalAttempts: number;
  days: IYearlyStreakDay[];
}

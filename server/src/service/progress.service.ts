import progressModel from "@/models/progress/progress.model";
import quizAttemptsModel from "@/models/quizAttempts/quizAttempts.model";
import userModel from "@/models/user/user.model";
import courseModel from "@/models/course/course.model";
import { Iprogress } from "@/types/progress.types";
import { Types } from "mongoose";

export interface IUserOverallProgress {
  totalCourses: number;
  totalQuizzes: number;
  overallAccuracy: number;
  overallAverageScore: number;
  strongTopics: string[];
  weakTopics: string[];
}

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

class ProgressService {
  static async updateProgress(
    userId: string,
    courseId: string,
    topic: string,
    score: number,
    total: number
  ): Promise<Iprogress> {
    const accuracy = total > 0 ? (score / total) * 100 : 0;

    const userObjId = new Types.ObjectId(userId);
    const courseObjId = new Types.ObjectId(courseId);

    let progress = await progressModel.findOne({ userId: userObjId, courseId: courseObjId });

    if (!progress) {
      progress = await progressModel.create({
        userId: userObjId,
        courseId: courseObjId,
        totalQuizzes: 1,
        accuracy,
        averageScore: score,
        strongTopics: accuracy > 70 ? [topic] : [],
        weakTopics: accuracy < 40 ? [topic] : []
      });
    } else {
      progress.totalQuizzes += 1;

      // Running average: newAvg = oldAvg + (score - oldAvg) / newCount
      progress.averageScore =
        progress.averageScore +
        (score - progress.averageScore) / progress.totalQuizzes;

      // Overall accuracy: running average of per-attempt accuracy
      progress.accuracy =
        progress.accuracy + (accuracy - progress.accuracy) / progress.totalQuizzes;

      if (accuracy > 70 && !progress.strongTopics.includes(topic)) {
        progress.strongTopics.push(topic);
      }

      if (accuracy < 40 && !progress.weakTopics.includes(topic)) {
        progress.weakTopics.push(topic);
      }

      await progress.save();
    }

    return progress;
  }

  static async getProgress(
    userId: string,
    courseId: string
  ): Promise<Iprogress | null> {
    return progressModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId)
    });
  }

  static async getCourseWiseProgress(userId: string): Promise<Iprogress[]> {
    return progressModel.find({
      userId: new Types.ObjectId(userId)
    });
  }

  static async getUserOverallProgress(userId: string): Promise<IUserOverallProgress> {
    const courseWiseProgress = await this.getCourseWiseProgress(userId);

    if (courseWiseProgress.length === 0) {
      return {
        totalCourses: 0,
        totalQuizzes: 0,
        overallAccuracy: 0,
        overallAverageScore: 0,
        strongTopics: [],
        weakTopics: []
      };
    }

    const strongTopicSet = new Set<string>();
    const weakTopicSet = new Set<string>();

    let totalQuizzes = 0;
    let weightedAccuracy = 0;
    let weightedAverageScore = 0;

    for (const progress of courseWiseProgress) {
      totalQuizzes += progress.totalQuizzes;
      weightedAccuracy += progress.accuracy * progress.totalQuizzes;
      weightedAverageScore += progress.averageScore * progress.totalQuizzes;

      for (const topic of progress.strongTopics) {
        strongTopicSet.add(topic);
      }

      for (const topic of progress.weakTopics) {
        weakTopicSet.add(topic);
      }
    }

    const overallAccuracy = totalQuizzes > 0 ? weightedAccuracy / totalQuizzes : 0;
    const overallAverageScore =
      totalQuizzes > 0 ? weightedAverageScore / totalQuizzes : 0;

    return {
      totalCourses: courseWiseProgress.length,
      totalQuizzes,
      overallAccuracy,
      overallAverageScore,
      strongTopics: Array.from(strongTopicSet),
      weakTopics: Array.from(weakTopicSet)
    };
  }

  static async getWeeklyPerformance(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Aggregation to get accuracy per day for the last 7 days
    const stats = await quizAttemptsModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          accuracy: {
            $cond: [
              { $gt: [{ $size: "$questions" }, 0] },
              { $multiply: [{ $divide: ["$score", { $size: "$questions" }] }, 100] },
              0
            ]
          }
        }
      },
      {
        $group: {
          _id: "$date",
          avgAccuracy: { $avg: "$accuracy" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Map to last 7 days including days with 0 accuracy
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = days[d.getDay()];
      
      const dayData = stats.find((s: any) => s._id === dateStr);
      result.push({
        day: dayLabel,
        score: dayData ? Math.round(dayData.avgAccuracy) : 0
      });
    }

    return result;
  }

  static async getYearlyStreak(userId: string): Promise<IYearlyStreak> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    const dailyAttempts = await quizAttemptsModel.aggregate<{ _id: string; attempts: number }>([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate }
        }
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date"
            }
          }
        }
      },
      {
        $group: {
          _id: "$date",
          attempts: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const attemptsByDate = new Map<string, number>();
    for (const entry of dailyAttempts) {
      attemptsByDate.set(entry._id, entry.attempts);
    }

    const days: IYearlyStreakDay[] = [];
    let totalAttempts = 0;
    let totalActiveDays = 0;

    for (let i = 1; i < 366; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dayKey = day.toISOString().split("T")[0];
      const attempts = attemptsByDate.get(dayKey) ?? 0;

      if (attempts > 0) {
        totalActiveDays += 1;
      }

      totalAttempts += attempts;
      days.push({
        date: dayKey,
        attempts,
        active: attempts > 0
      });
    }

    let longestStreak = 0;
    let runningStreak = 0;

    for (const day of days) {
      if (day.active) {
        runningStreak += 1;
        if (runningStreak > longestStreak) {
          longestStreak = runningStreak;
        }
      } else {
        runningStreak = 0;
      }
    }

    let currentStreak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (!days[i].active) {
        break;
      }
      currentStreak += 1;
    }

    return {
      currentStreak,
      longestStreak,
      totalActiveDays,
      totalAttempts,
      days
    };
  }

  static async getPlatformStats() {
    const [totalUsers, totalQuizzes, courses] = await Promise.all([
      userModel.countDocuments({ role: "student" }),
      quizAttemptsModel.countDocuments({}),
      courseModel.find({}).lean()
    ]);

    // Calculate global average accuracy from all progress records
    const progressStats = await progressModel.aggregate([
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: "$accuracy" }
        }
      }
    ]);

    const averagePlatformScore = progressStats.length > 0 ? Math.round(progressStats[0].avgAccuracy) : 0;

    // Calculate course popularity (enrollment count and completion/attempt proxy)
    const coursePopularityStats = await progressModel.aggregate([
      {
        $group: {
          _id: "$courseId",
          enrolled: { $sum: 1 },
          totalAttempts: { $sum: "$totalQuizzes" }
        }
      }
    ]);

    const coursePopularity = courses.map(course => {
      const stats = coursePopularityStats.find(s => s._id.toString() === course._id.toString());
      return {
        name: course.title,
        enrolled: stats ? stats.enrolled : 0,
        completions: stats ? stats.totalAttempts : 0 // Using totalAttempts as completions for now
      };
    });

    return {
      totalUsers,
      totalQuizzes,
      averagePlatformScore,
      coursePopularity
    };
  }
}

export default ProgressService;

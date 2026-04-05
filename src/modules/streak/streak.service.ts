import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Streak, StreakDocument } from '../../schemas/streak.schema';

@Injectable()
export class StreakService {
  constructor(
    @InjectModel(Streak.name)
    private readonly streakModel: Model<StreakDocument>,
  ) {}

  async checkIn(userId: string): Promise<StreakDocument> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userObjectId = new Types.ObjectId(userId);

    let streak = await this.streakModel.findOne({ user: userObjectId });

    if (!streak) {
      // First-time check-in
      streak = new this.streakModel({
        user: userObjectId,
        currentStreak: 1,
        longestStreak: 1,
        totalDays: 1,
        lastActivityDate: today,
      });
      return streak.save();
    }

    const last = streak.lastActivityDate
      ? new Date(streak.lastActivityDate)
      : null;

    if (last) {
      last.setHours(0, 0, 0, 0);
      const diffMs = today.getTime() - last.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already checked in today – no change
        return streak;
      } else if (diffDays === 1) {
        // Consecutive day – increment
        streak.currentStreak += 1;
      } else {
        // Missed at least one day – reset
        streak.currentStreak = 1;
      }
    } else {
      streak.currentStreak = 1;
    }

    streak.totalDays += 1;
    streak.lastActivityDate = today;
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    return streak.save();
  }

  async getMyStreak(userId: string): Promise<StreakDocument | null> {
    return this.streakModel.findOne({ user: new Types.ObjectId(userId) }).exec();
  }
}

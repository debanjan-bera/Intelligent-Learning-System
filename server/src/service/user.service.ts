import userModel from "@/models/user/user.model";
import progressModel from "@/models/progress/progress.model";
import quizAttemptsModel from "@/models/quizAttempts/quizAttempts.model";

class UserService {
    private static async enrichUser(user: any) {
        const [progressCount, attemptsCount, progressData] = await Promise.all([
            progressModel.countDocuments({ userId: user._id }),
            quizAttemptsModel.countDocuments({ userId: user._id }),
            progressModel.aggregate([
                { $match: { userId: user._id } },
                { $group: { _id: null, avgAccuracy: { $avg: "$accuracy" } } }
            ])
        ]);

        return {
            ...user,
            status: "active",
            avatar: user.name.charAt(0).toUpperCase(),
            joinedDate: user.createdAt,
            enrolledCourses: progressCount,
            quizzesCompleted: attemptsCount,
            averageScore: progressData.length > 0 ? Math.round(progressData[0].avgAccuracy) : 0
        };
    }

    static async getAllStudents() {
        try {
            const students = await userModel.find({ role: "student" }).select("-password").lean();
            return await Promise.all(students.map(s => this.enrichUser(s)));
        } catch (error: any) {
            throw new Error(error.message || "Error fetching students");
        }
    }

    static async getAllEnrichedUsers() {
        try {
            const users = await userModel.find().select("-password").lean();
            return await Promise.all(users.map(u => this.enrichUser(u)));
        } catch (error: any) {
            throw new Error(error.message || "Error fetching users");
        }
    }

    static async getAllUsers() {
        try {
            const users = await userModel.find().select("-password");
            return users;
        } catch (error: any) {
            throw new Error(error.message || "Error fetching users");
        }
    }

    static async getUserById(id: string) {
        try {
            const user = await userModel.findById(id).select("-password").lean();
            if (!user) return null;
            return await this.enrichUser(user);
        } catch (error: any) {
            throw new Error(error.message || "Error fetching user");
        }
    }
}

export default UserService;

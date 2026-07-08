import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function check() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not found");
    
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} total users`);
    users.forEach(u => console.log(`- ${u.name || 'NO NAME'} (${u.email}) - Role: ${u.role}`));

    if (users.length > 0) {
      const enrichedStudents = await Promise.all(users.map(async (student) => {
        try {
            console.log(`Enriching student: ${student.name} (${student._id})`);
            const progressCount = await mongoose.connection.db.collection('progresses').countDocuments({ userId: student._id });
            const attemptsCount = await mongoose.connection.db.collection('quizattempts').countDocuments({ userId: student._id });
            
            const progressData = await mongoose.connection.db.collection('progresses').aggregate([
                { $match: { userId: student._id } },
                { $group: { _id: null, avgAccuracy: { $avg: "$accuracy" } } }
            ]).toArray();

            console.log(`- Progress count: ${progressCount}`);
            console.log(`- Attempts count: ${attemptsCount}`);
            console.log(`- Progress data:`, progressData);

            return {
                ...student,
                status: "active",
                avatar: student.name ? student.name.charAt(0).toUpperCase() : "?",
                joinedDate: student.createdAt,
                enrolledCourses: progressCount,
                quizzesCompleted: attemptsCount,
                averageScore: progressData.length > 0 ? Math.round(progressData[0].avgAccuracy) : 0
            };
        } catch (err) {
            console.error(`Failed to enrich student ${student._id}:`, err);
            throw err;
        }
      }));

      console.log("Enriched Students success!");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

check();

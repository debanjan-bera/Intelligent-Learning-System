import courseModel from "@/models/course/course.model";
import { ICourse } from "@/types/course.types";

class courseService {
static async createCourse( { title, description, difficulty }:ICourse) {
    try {
        const newCourse = await courseModel.create({
            title,
            description,
            difficulty,
        });

        return newCourse;
    } catch (error) {
        throw new Error("Error creating course");
    }

}

static async getAllCourses() {
    try {
        const courses = await courseModel.find().populate("topics");
        return courses;
    } catch (error) {
        throw new Error("Error fetching courses");
    }
}

static async getCourseById(courseId: string) {
    try {
        const course = await courseModel.findById(courseId).populate("topics");
        if (!course) {
            throw new Error("Course not found");
        }
        return course;
    } catch (error) {
        throw new Error("Error fetching course");
    }

}

static async updateCourse(courseId: string, { title, description, difficulty }: ICourse) {
    try {
        const updatedCourse = await courseModel.findByIdAndUpdate(
            courseId,
            { title, description, difficulty },
            { returnDocument: "after" }
        );

        if (!updatedCourse) {
            throw new Error("Course not found");
        }

        return updatedCourse;
    } catch (error) {
        throw new Error("Error updating course");
    }
}


static async deleteCourse(courseId: string) {
    try {
        const deletedCourse = await courseModel.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            throw new Error("Course not found");
        }
        return deletedCourse;
    } catch (error) {
        throw new Error("Error deleting course");
    }

}

}

export default courseService;
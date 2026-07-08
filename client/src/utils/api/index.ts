import { login, me, register } from "./auth/auth.api";
import { fetchAllCourses, fetchCourseById, createCourse, updateCourse, deleteCourse, fetchTopicsByCourseId, fetchTopicById, createTopic, updateTopic, deleteTopic } from "./course/course.api";
import { startQuiz, submitQuiz } from "./quiz/quiz.api";

export const api = {
    auth: {
        me,
        login,
        register
    },
    course: {
        fetchAllCourses,
        fetchCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        fetchTopicsByCourseId,
        fetchTopicById,
        createTopic,
        updateTopic,
        deleteTopic
    },
    quiz: {
        startQuiz,
        submitQuiz
    }

};

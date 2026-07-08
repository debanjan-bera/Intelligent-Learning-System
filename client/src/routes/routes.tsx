import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import Dashboard from "@/pages/users/Dashboard";
import Courses from "@/pages/users/Courses";
import CourseDetails from "@/pages/users/CourseDetails";
import QuizPage from "@/pages/users/Quiz";
import Results from "@/pages/users/Results";
import History from "@/pages/users/History";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminCourseFormPage from "@/pages/admin/AdminCourseForm";
import AdminUsers from "@/pages/admin/AdminUsers";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import AdminCourseDetails from "@/pages/admin/AdminCourseDetails";

const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Auth routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* User routes (restricted to student role) */}
            <Route path="/" element={<ProtectedRoute allowedRoles={["student"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute allowedRoles={["student"]}><Courses /></ProtectedRoute>} />
            <Route path="/courses/:id" element={<ProtectedRoute allowedRoles={["student"]}><CourseDetails /></ProtectedRoute>} />
            <Route path="/quiz/:courseId" element={<ProtectedRoute allowedRoles={["student"]}><QuizPage /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute allowedRoles={["student"]}><Results /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={["student"]}><History /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCourses /></ProtectedRoute>} />
            <Route path="/admin/courses/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCourseDetails /></ProtectedRoute>} />
            <Route path="/admin/courses/new" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCourseFormPage /></ProtectedRoute>} />
            <Route path="/admin/courses/:id/edit" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCourseFormPage /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
        </>
    )
);

export default routes;

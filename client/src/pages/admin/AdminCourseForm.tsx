import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CourseForm } from "@/components/admin/CourseForm";
import { TopicManager } from "@/components/admin/TopicManager";
import { useAdminContext } from "@/context/AdminContext";

export default function AdminCourseForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addCourse, updateCourse, getCourseById, addTopic } = useAdminContext();

    const isEdit = !!id;
    const existing = id ? getCourseById(id) : undefined;

    const handleSave = async (values: any) => {

        if (isEdit && id) {
            const res = await updateCourse(id, {
                title: values.title,
                description: values.description,
                difficulty: values.difficulty
            });
            if (res) navigate(`/admin/courses/${id}`);
        } else {
            const newCourse = await addCourse({
                title: values.title,
                description: values.description,
                difficulty: values.difficulty,
            });

            if (newCourse) {
                const createdCourseId = newCourse._id || (newCourse as any).id;
                
                // 2. Create Topics if any
                if (values.draftTopics && values.draftTopics.length > 0) {
                    await Promise.all(
                        values.draftTopics.map((topic: any) => 
                            addTopic({
                                name: topic.name,
                                description: topic.description,
                                courseId: createdCourseId
                            })
                        )
                    );
                }
                
                navigate(`/admin/courses/${createdCourseId}`);
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                <div className="space-y-6">
                    <div>
                        <Link
                            to="/admin/courses"
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Courses
                        </Link>
                        <h1 className="text-2xl font-bold text-foreground">
                            {isEdit ? "Edit Course" : "Add New Course"}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {isEdit ? "Update course details and topics." : "Create a new course for the platform."}
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <CourseForm
                            initial={existing}
                            onSave={handleSave}
                            onCancel={() => navigate("/admin/courses")}
                            isEdit={isEdit}
                        />
                    </div>
                </div>

                {isEdit && id && (
                    <div className="space-y-6 pb-10">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Course Content</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">Configure topics and learning materials.</p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <TopicManager courseId={id} />
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

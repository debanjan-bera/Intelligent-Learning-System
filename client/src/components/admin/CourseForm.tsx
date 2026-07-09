import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Course } from "@/@types/interface/course.interface";

type CourseFormValues = {
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    draftTopics: { name: string; description: string }[];
};

interface CourseFormProps {
    initial?: Partial<Course>;
    onSave: (values: CourseFormValues) => void;
    onCancel: () => void;
    isEdit?: boolean;
}

const difficulties = ["beginner", "intermediate", "advanced"] as const;
type Difficulty = (typeof difficulties)[number];



export function CourseForm({ initial, onSave, onCancel, isEdit }: CourseFormProps) {
    const [form, setForm] = useState<CourseFormValues>({
        title: initial?.title ?? "",
        description: initial?.description ?? "",
        difficulty: (initial?.difficulty as Difficulty) ?? "beginner",
        draftTopics: [],
    });

    const [newTopic, setNewTopic] = useState({ name: "", description: "" });

    const addDraftTopic = () => {
        if (!newTopic.name.trim()) return;
        setForm((f) => ({
            ...f,
            draftTopics: [...f.draftTopics, { ...newTopic }],
        }));
        setNewTopic({ name: "", description: "" });
    };

    const removeDraftTopic = (index: number) => {
        setForm((f) => ({
            ...f,
            draftTopics: f.draftTopics.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...form,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Course Title *</label>
                    <input
                        required
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Introduction to Machine Learning"
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
                    <textarea
                        required
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        rows={3}
                        placeholder="Brief description of what students will learn..."
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                </div>

                {/* Difficulty */}
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Difficulty</label>
                    <select
                        value={form.difficulty}
                        onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as Difficulty }))}
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary capitalize"
                    >
                        {difficulties.map((d) => (
                            <option key={d} value={d} className="capitalize">{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {!isEdit && (
                <div className="pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Initial Topics (Optional)</h3>
                    <div className="space-y-3 mb-4">
                        {form.draftTopics.map((t, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/40 border border-border">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p>
                                </div>
                                <button type="button" onClick={() => removeDraftTopic(idx)} className="text-muted-foreground hover:text-red-500">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 p-4 bg-secondary/20 rounded-xl border border-dashed border-border">
                        <input
                            placeholder="Topic Name"
                            value={newTopic.name}
                            onChange={(e) => setNewTopic(n => ({ ...n, name: e.target.value }))}
                            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <textarea
                            placeholder="Topic Description"
                            value={newTopic.description}
                            onChange={(e) => setNewTopic(n => ({ ...n, description: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                            rows={2}
                        />
                        <button
                            type="button"
                            onClick={addDraftTopic}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add to List
                        </button>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    {isEdit ? "Update Course" : `Create Course ${form.draftTopics.length > 0 ? `& ${form.draftTopics.length} Topics` : ""}`}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 border border-border text-muted-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

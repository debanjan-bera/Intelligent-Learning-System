import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";
import type { Topic } from "@/@types/interface/course.interface";

interface TopicManagerProps {
    courseId: string;
}

export function TopicManager({ courseId }: TopicManagerProps) {
    const { fetchTopics, addTopic, updateTopic, deleteTopic, getTopicsByCourseId } = useAdminContext();
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", description: "" });

    const topics = getTopicsByCourseId(courseId);

    const loadTopics = useCallback(async () => {
        setLoading(true);
        await fetchTopics(courseId);
        setLoading(false);
    }, [courseId, fetchTopics]);

    useEffect(() => {
        loadTopics();
    }, [loadTopics]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await addTopic({ ...form, courseId });
        if (res) {
            setIsAdding(false);
            setForm({ name: "", description: "" });
        }
    };

    const handleUpdate = async (id: string) => {
        const res = await updateTopic(id, form);
        if (res) {
            setEditingId(null);
            setForm({ name: "", description: "" });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this topic?")) {
            await deleteTopic(id);
        }
    };

    const startEdit = (topic: Topic) => {
        setEditingId(topic._id);
        setForm({ name: topic.name, description: topic.description });
    };

    if (loading && topics.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Course Topics</h3>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                    >
                        <Plus className="w-4 h-4" /> Add Topic
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {isAdding && (
                    <form onSubmit={handleAdd} className="p-4 bg-secondary/40 rounded-xl border border-primary/20 space-y-3">
                        <input
                            required
                            autoFocus
                            placeholder="Topic Name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <textarea
                            required
                            placeholder="Topic Description"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                            rows={2}
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90"
                            >
                                Save Topic
                            </button>
                        </div>
                    </form>
                )}

                {topics.length === 0 && !isAdding && (
                    <div className="text-center py-6 border-2 border-dashed border-border rounded-xl">
                        <p className="text-sm text-muted-foreground">No topics found for this course.</p>
                    </div>
                )}

                {topics.map((topic) => (
                    <div key={topic._id} className="group p-4 bg-card border border-border rounded-xl transition-all hover:border-primary/30">
                        {editingId === topic._id ? (
                            <div className="space-y-3">
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm"
                                />
                                <textarea
                                    required
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none"
                                    rows={2}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="p-1.5 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleUpdate(topic._id)}
                                        className="p-1.5 bg-primary text-white rounded-lg"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-foreground">{topic.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEdit(topic)}
                                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(topic._id)}
                                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

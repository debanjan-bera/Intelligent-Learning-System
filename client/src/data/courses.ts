export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Topic {
    id: string;
    title: string;
    completed: boolean;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    topics: Topic[];
    progress: number; // 0-100
    enrolled: boolean;
    imageColor: string; // tailwind gradient
    totalQuestions: number;
    estimatedTime: string;
}

export const mockCourses: Course[] = [
    {
        id: "ml-101",
        title: "Introduction to Machine Learning",
        description:
            "Learn the fundamentals of machine learning, algorithms, and statistical models. Build your first ML pipeline from scratch.",
        difficulty: "beginner",
        topics: [
            { id: "t1", title: "Supervised Learning", completed: true },
            { id: "t2", title: "Unsupervised Learning", completed: true },
            { id: "t3", title: "Model Evaluation", completed: false },
            { id: "t4", title: "Feature Engineering", completed: false },
        ],
        progress: 45,
        enrolled: true,
        imageColor: "from-orange-400 to-orange-600",
        totalQuestions: 40,
        estimatedTime: "6 hours",
    },
    {
        id: "dl-201",
        title: "Deep Learning Fundamentals",
        description:
            "Explore neural networks, backpropagation, and modern architectures like CNNs and RNNs.",
        difficulty: "intermediate",
        topics: [
            { id: "t1", title: "Neural Networks", completed: true },
            { id: "t2", title: "Convolutional Neural Nets", completed: false },
            { id: "t3", title: "Recurrent Neural Nets", completed: false },
            { id: "t4", title: "Transfer Learning", completed: false },
        ],
        progress: 12,
        enrolled: true,
        imageColor: "from-amber-400 to-orange-500",
        totalQuestions: 50,
        estimatedTime: "8 hours",
    },
    {
        id: "nlp-301",
        title: "Natural Language Processing",
        description:
            "Build models that can understand, interpret, and generate human language using transformers and LLMs.",
        difficulty: "advanced",
        topics: [
            { id: "t1", title: "Text Preprocessing", completed: false },
            { id: "t2", title: "Word Embeddings", completed: false },
            { id: "t3", title: "Transformer Architecture", completed: false },
            { id: "t4", title: "Fine-tuning LLMs", completed: false },
        ],
        progress: 0,
        enrolled: false,
        imageColor: "from-red-400 to-orange-600",
        totalQuestions: 60,
        estimatedTime: "10 hours",
    },
    {
        id: "cv-201",
        title: "Computer Vision",
        description:
            "Master image recognition, object detection, and visual understanding with state-of-the-art architectures.",
        difficulty: "intermediate",
        topics: [
            { id: "t1", title: "Image Classification", completed: true },
            { id: "t2", title: "Object Detection", completed: false },
            { id: "t3", title: "Image Segmentation", completed: false },
            { id: "t4", title: "GANs", completed: false },
        ],
        progress: 22,
        enrolled: true,
        imageColor: "from-orange-300 to-amber-500",
        totalQuestions: 45,
        estimatedTime: "7 hours",
    },
    {
        id: "rl-301",
        title: "Reinforcement Learning",
        description:
            "Learn how AI agents learn to make decisions through reward-based training and dynamic environments.",
        difficulty: "advanced",
        topics: [
            { id: "t1", title: "Markov Processes", completed: false },
            { id: "t2", title: "Q-Learning", completed: false },
            { id: "t3", title: "Policy Gradients", completed: false },
            { id: "t4", title: "Deep RL", completed: false },
        ],
        progress: 0,
        enrolled: false,
        imageColor: "from-yellow-400 to-orange-500",
        totalQuestions: 55,
        estimatedTime: "12 hours",
    },
    {
        id: "stats-101",
        title: "Statistics for Data Science",
        description:
            "Master probability, statistical inference, hypothesis testing, and Bayesian thinking for AI.",
        difficulty: "beginner",
        topics: [
            { id: "t1", title: "Probability Theory", completed: true },
            { id: "t2", title: "Distributions", completed: true },
            { id: "t3", title: "Hypothesis Testing", completed: true },
            { id: "t4", title: "Bayesian Statistics", completed: false },
        ],
        progress: 70,
        enrolled: true,
        imageColor: "from-orange-500 to-red-500",
        totalQuestions: 35,
        estimatedTime: "5 hours",
    },
];

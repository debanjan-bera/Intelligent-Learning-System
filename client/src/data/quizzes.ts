export interface QuizOption {
    id: string;
    text: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: QuizOption[];
    correctOptionId: string;
    explanation: string;
    topic: string;
}

export interface Quiz {
    courseId: string;
    difficulty: "easy" | "medium" | "hard";
    questions: QuizQuestion[];
    timePerQuestion: number; // seconds
}

const mlQuestions: QuizQuestion[] = [
    {
        id: "q1",
        question: "Which algorithm is used for classification tasks by finding the hyperplane that best separates data classes?",
        options: [
            { id: "a", text: "K-Means Clustering" },
            { id: "b", text: "Support Vector Machine (SVM)" },
            { id: "c", text: "Linear Regression" },
            { id: "d", text: "Principal Component Analysis" },
        ],
        correctOptionId: "b",
        explanation: "SVMs work by finding the optimal hyperplane that maximizes the margin between classes. They are powerful for both linear and non-linear classification via the kernel trick.",
        topic: "Supervised Learning",
    },
    {
        id: "q2",
        question: "What does 'overfitting' mean in machine learning?",
        options: [
            { id: "a", text: "The model performs poorly on training data" },
            { id: "b", text: "The model is too simple to capture patterns" },
            { id: "c", text: "The model memorizes training data but fails on new data" },
            { id: "d", text: "The training process takes too long" },
        ],
        correctOptionId: "c",
        explanation: "Overfitting occurs when a model learns the training data too well, including noise and outliers, leading to poor generalization on unseen data. Regularization and cross-validation help prevent this.",
        topic: "Model Evaluation",
    },
    {
        id: "q3",
        question: "Which of the following is an unsupervised learning algorithm?",
        options: [
            { id: "a", text: "Logistic Regression" },
            { id: "b", text: "Decision Trees" },
            { id: "c", text: "K-Means Clustering" },
            { id: "d", text: "Random Forest" },
        ],
        correctOptionId: "c",
        explanation: "K-Means is an unsupervised clustering algorithm that groups data into K clusters based on feature similarity, without requiring labeled training data.",
        topic: "Unsupervised Learning",
    },
    {
        id: "q4",
        question: "What is the purpose of cross-validation in machine learning?",
        options: [
            { id: "a", text: "To increase training speed" },
            { id: "b", text: "To evaluate model performance on unseen data" },
            { id: "c", text: "To reduce the number of features" },
            { id: "d", text: "To normalize the dataset" },
        ],
        correctOptionId: "b",
        explanation: "Cross-validation splits data into multiple folds to assess how a model generalizes to an independent dataset, helping detect overfitting and tune hyperparameters.",
        topic: "Model Evaluation",
    },
    {
        id: "q5",
        question: "Which metric is most appropriate for evaluating an imbalanced classification problem?",
        options: [
            { id: "a", text: "Accuracy" },
            { id: "b", text: "Mean Squared Error" },
            { id: "c", text: "F1 Score" },
            { id: "d", text: "R-squared" },
        ],
        correctOptionId: "c",
        explanation: "F1 Score balances precision and recall, making it ideal for imbalanced datasets where accuracy can be misleading (e.g., 95% accuracy when 95% of data is one class).",
        topic: "Model Evaluation",
    },
    {
        id: "q6",
        question: "What is feature scaling and why is it important?",
        options: [
            { id: "a", text: "Adding new features to improve accuracy" },
            { id: "b", text: "Normalizing features to a similar range for algorithms sensitive to magnitude" },
            { id: "c", text: "Removing outliers from the dataset" },
            { id: "d", text: "Selecting the most important features" },
        ],
        correctOptionId: "b",
        explanation: "Feature scaling standardizes the range of features. Algorithms like SVM, KNN, and gradient descent converge faster and perform better when features are on similar scales.",
        topic: "Feature Engineering",
    },
    {
        id: "q7",
        question: "What does the ROC-AUC score measure?",
        options: [
            { id: "a", text: "The speed of the model" },
            { id: "b", text: "The model's ability to distinguish between classes" },
            { id: "c", text: "The number of parameters" },
            { id: "d", text: "The variance of predictions" },
        ],
        correctOptionId: "b",
        explanation: "ROC-AUC measures the probability that a classifier ranks a positive instance higher than a negative one. A score of 1.0 is perfect; 0.5 indicates random guessing.",
        topic: "Model Evaluation",
    },
    {
        id: "q8",
        question: "Which ensemble method builds trees sequentially, correcting errors of previous trees?",
        options: [
            { id: "a", text: "Bagging" },
            { id: "b", text: "Random Forest" },
            { id: "c", text: "Gradient Boosting" },
            { id: "d", text: "Stacking" },
        ],
        correctOptionId: "c",
        explanation: "Gradient Boosting builds trees sequentially where each tree corrects the residual errors of the previous one. It produces highly accurate models and is used in XGBoost and LightGBM.",
        topic: "Supervised Learning",
    },
    {
        id: "q9",
        question: "What is the 'curse of dimensionality'?",
        options: [
            { id: "a", text: "Too many training samples slow down learning" },
            { id: "b", text: "High-dimensional data becomes sparse, making it hard to find patterns" },
            { id: "c", text: "Models with too many layers overfit easily" },
            { id: "d", text: "Data preprocessing becomes harder with more features" },
        ],
        correctOptionId: "b",
        explanation: "As dimensions increase, data becomes increasingly sparse in the feature space, requiring exponentially more data to maintain statistical significance. PCA and feature selection help mitigate this.",
        topic: "Feature Engineering",
    },
    {
        id: "q10",
        question: "Which technique randomly drops neurons during training to prevent overfitting in neural networks?",
        options: [
            { id: "a", text: "Batch Normalization" },
            { id: "b", text: "L2 Regularization" },
            { id: "c", text: "Dropout" },
            { id: "d", text: "Early Stopping" },
        ],
        correctOptionId: "c",
        explanation: "Dropout randomly sets a fraction of neurons to zero during each training step, forcing the network to learn redundant representations and preventing co-adaptation of neurons.",
        topic: "Supervised Learning",
    },
];

export const mockQuizzes: Quiz[] = [
    { courseId: "ml-101", difficulty: "easy", questions: mlQuestions.slice(0, 5), timePerQuestion: 45 },
    { courseId: "ml-101", difficulty: "medium", questions: mlQuestions.slice(0, 8), timePerQuestion: 35 },
    { courseId: "ml-101", difficulty: "hard", questions: mlQuestions, timePerQuestion: 25 },
    { courseId: "dl-201", difficulty: "easy", questions: mlQuestions.slice(0, 5), timePerQuestion: 45 },
    { courseId: "dl-201", difficulty: "medium", questions: mlQuestions.slice(0, 8), timePerQuestion: 35 },
    { courseId: "cv-201", difficulty: "easy", questions: mlQuestions.slice(0, 5), timePerQuestion: 45 },
    { courseId: "stats-101", difficulty: "easy", questions: mlQuestions.slice(0, 5), timePerQuestion: 50 },
    { courseId: "stats-101", difficulty: "medium", questions: mlQuestions.slice(0, 8), timePerQuestion: 40 },
];

import { Lesson } from "./types";

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: "intro-ml",
    title: "Introduction to Machine Learning",
    description: "What is ML and why does it matter? Explore the core concepts of supervised and unsupervised learning.",
    level: "Beginner",
    category: "Foundations"
  },
  {
    id: "linear-regression",
    title: "Linear Regression",
    description: "Learn how to predict continuous values using the simplest yet most powerful statistical model.",
    level: "Beginner",
    category: "Supervised Learning"
  },
  {
    id: "neural-networks",
    title: "Neural Networks Basics",
    description: "Understand the biological inspiration behind deep learning and how artificial neurons work.",
    level: "Intermediate",
    category: "Deep Learning"
  },
  {
    id: "decision-trees",
    title: "Decision Trees & Random Forests",
    description: "Master tree-based algorithms for classification and regression tasks.",
    level: "Intermediate",
    category: "Supervised Learning"
  },
  {
    id: "clustering",
    title: "K-Means Clustering",
    description: "Discover patterns in unlabeled data using one of the most popular unsupervised learning techniques.",
    level: "Intermediate",
    category: "Unsupervised Learning"
  },
  {
    id: "transformers",
    title: "Attention & Transformers",
    description: "Dive into the architecture that powers modern LLMs like GPT and Gemini.",
    level: "Advanced",
    category: "Deep Learning"
  }
];

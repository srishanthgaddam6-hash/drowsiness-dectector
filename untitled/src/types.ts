export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

export interface LessonContent {
  text: string;
  code?: string;
  explanation: string;
  visualPrompt: string;
}

export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

export interface UserProfile {
  name: string;
  learningStyle: LearningStyle;
  progress: string[]; // lesson ids
}

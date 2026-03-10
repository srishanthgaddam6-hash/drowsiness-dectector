import { Lesson } from "../types";
import { BookOpen, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface LessonCardProps {
  lesson: Lesson;
  onClick: (lesson: Lesson) => void;
}

export const LessonCard = ({ lesson, onClick }: LessonCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(lesson)}
      className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <BookOpen className="w-5 h-5 text-emerald-600" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          lesson.level === 'Beginner' ? 'bg-blue-50 text-blue-600' :
          lesson.level === 'Intermediate' ? 'bg-orange-50 text-orange-600' :
          'bg-purple-50 text-purple-600'
        }`}>
          {lesson.level}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors">
        {lesson.title}
      </h3>
      <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
        {lesson.description}
      </p>
      <div className="flex items-center text-emerald-600 text-sm font-medium">
        Start Lesson
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

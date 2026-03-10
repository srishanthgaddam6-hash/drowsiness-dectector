import React from 'react';
import { LearningStyle } from '../types';
import { Eye, Headphones, Book, MousePointer2, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface StyleSelectorProps {
  selected: LearningStyle;
  onSelect: (style: LearningStyle) => void;
}

const STYLES: { id: LearningStyle; label: string; icon: any; description: string }[] = [
  { id: 'visual', label: 'Visual', icon: Eye, description: 'Learn through diagrams and illustrations.' },
  { id: 'auditory', label: 'Auditory', icon: Headphones, description: 'Learn through audio explanations and speech.' },
  { id: 'reading', label: 'Reading', icon: Book, description: 'Learn through detailed text and documentation.' },
  { id: 'kinesthetic', label: 'Kinesthetic', icon: MousePointer2, description: 'Learn through interactive code and examples.' },
];

export const StyleSelector = ({ selected, onSelect }: StyleSelectorProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STYLES.map((style) => {
        const Icon = style.icon;
        const isSelected = selected === style.id;
        return (
          <motion.button
            key={style.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(style.id)}
            className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
              isSelected 
                ? 'border-emerald-600 bg-emerald-50 shadow-sm' 
                : 'border-black/5 bg-white hover:border-emerald-200'
            }`}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-0.5">
                <Check className="w-3 h-3" />
              </div>
            )}
            <div className={`p-2 rounded-lg mb-3 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className={`font-semibold mb-1 ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
              {style.label}
            </h3>
            <p className={`text-xs ${isSelected ? 'text-emerald-700' : 'text-zinc-500'}`}>
              {style.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
};

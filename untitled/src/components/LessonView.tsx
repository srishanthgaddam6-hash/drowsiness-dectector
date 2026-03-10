import React, { useState, useEffect } from 'react';
import { Lesson, LessonContent, LearningStyle } from '../types';
import { generateLessonContent, generateVisual, generateAudio } from '../services/gemini';
import { Play, Volume2, Image as ImageIcon, Code, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

interface LessonViewProps {
  lesson: Lesson;
  learningStyle: LearningStyle;
  onBack: () => void;
}

export const LessonView = ({ lesson, learningStyle, onBack }: LessonViewProps) => {
  const [content, setContent] = useState<LessonContent | null>(null);
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const data = await generateLessonContent(lesson.title, learningStyle, lesson.level);
        setContent(data);
      } catch (error) {
        console.error("Failed to load lesson content", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, [lesson, learningStyle]);

  const handleGenerateVisual = async () => {
    if (!content?.visualPrompt || isGeneratingVisual) return;
    setIsGeneratingVisual(true);
    try {
      const url = await generateVisual(content.visualPrompt);
      setVisualUrl(url);
    } catch (error) {
      console.error("Visual generation failed", error);
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!content?.text || isGeneratingAudio) return;
    setIsGeneratingAudio(true);
    try {
      const url = await generateAudio(content.text);
      setAudioUrl(url);
    } catch (error) {
      console.error("Audio generation failed", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        <p className="text-zinc-500 font-medium animate-pulse">Personalizing your lesson...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button
        onClick={onBack}
        className="flex items-center text-zinc-500 hover:text-zinc-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="space-y-8">
        <header>
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">AI Generated Lesson</span>
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">{lesson.title}</h1>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium">
              {lesson.level}
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
              Style: {learningStyle}
            </span>
          </div>
        </header>

        <section className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
          <div className="prose prose-zinc max-w-none">
            <Markdown>{content?.text}</Markdown>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isGeneratingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
              Listen to Explanation
            </button>
          </div>
          
          {audioUrl && (
            <div className="mt-4 p-4 bg-zinc-50 rounded-2xl border border-black/5">
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-zinc-900 rounded-3xl p-8 text-zinc-300 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Code Implementation</h3>
              </div>
            </div>
            <pre className="text-sm font-mono overflow-x-auto">
              <code>{content?.code || "# No code snippet for this concept"}</code>
            </pre>
          </section>

          <section className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            {visualUrl ? (
              <img src={visualUrl} alt="Visual explanation" className="rounded-2xl w-full h-auto shadow-lg" referrerPolicy="no-referrer" />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2">Visual Explanation</h3>
                <p className="text-sm text-zinc-500 mb-6">Generate an AI illustration to help visualize this concept.</p>
                <button
                  onClick={handleGenerateVisual}
                  disabled={isGeneratingVisual}
                  className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-medium disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isGeneratingVisual && <Loader2 className="w-4 h-4 animate-spin" />}
                  Generate Diagram
                </button>
              </div>
            )}
          </section>
        </div>

        <section className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">Deep Dive</h3>
          <div className="prose prose-emerald max-w-none text-emerald-800">
            <Markdown>{content?.explanation}</Markdown>
          </div>
        </section>
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { useQuizStore } from '@/store/quizStore';
import { motion } from 'framer-motion';

export const QuizSetup = () => {
  const { setConfig, startQuiz, isPracticeModeEnabled, togglePracticeMode } = useQuizStore();
  const [formData, setFormData] = useState<{
    name: string;
    level: 'junior' | 'senior';
    numberOfQuestions: number;
    duration: number;
    showHints: boolean;
  }>({
    name: '',
    level: 'junior',
    numberOfQuestions: 5,
    duration: 30,
    showHints: true,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    setConfig(formData);
    startQuiz();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === 'numberOfQuestions') {
      parsedValue = Math.min(Math.max(parseInt(value) || 5, 5), 20);
    } else if (name === 'duration') {
      parsedValue = Math.min(Math.max(parseInt(value) || 30, 30), 120);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="bg-white/90 backdrop-blur dark:bg-gray-800/90 p-8 rounded-3xl shadow-xl max-w-md w-full border-4 border-violet-200 dark:border-violet-800"
      >
        <motion.h1 
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", bounce: 0.6 }}
        >
          🎯 Math Quiz Setup
        </motion.h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-violet-700 dark:text-violet-300 mb-2">
              Student Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg border-2 border-violet-200 dark:border-violet-800 rounded-xl
                       bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300
                       placeholder:text-violet-300 dark:placeholder:text-violet-600"
              placeholder="Enter your name"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-lg font-medium text-violet-700 dark:text-violet-300 mb-2">
              Difficulty Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-violet-700 dark:text-violet-300 mb-2">
              Number of Questions (5-20)
            </label>
            <input
              type="number"
              name="numberOfQuestions"
              value={formData.numberOfQuestions}
              onChange={handleChange}
              min="5"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-violet-700 dark:text-violet-300 mb-2">
              Time per Question (30-120 seconds)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="30"
              max="120"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex gap-4">
              <motion.button
                onClick={togglePracticeMode}
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 px-6 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg
                  focus:outline-none focus:ring-4 focus:ring-offset-2 ${isPracticeModeEnabled 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white focus:ring-emerald-400'
                  : 'bg-gradient-to-r from-violet-100 to-indigo-100 hover:from-violet-200 hover:to-indigo-200 text-violet-700 focus:ring-violet-300'}`}
              >
                {isPracticeModeEnabled ? '🎮 Practice Mode On' : '🎯 Practice Mode Off'}
              </motion.button>

              <motion.button
                onClick={() => setFormData(prev => ({ ...prev, showHints: !prev.showHints }))}
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 px-6 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg
                  focus:outline-none focus:ring-4 focus:ring-offset-2 ${formData.showHints 
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-white focus:ring-amber-400'
                  : 'bg-gradient-to-r from-violet-100 to-indigo-100 hover:from-violet-200 hover:to-indigo-200 text-violet-700 focus:ring-violet-300'}`}
              >
                {formData.showHints ? '💡 Hints On' : '🤔 Hints Off'}
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 px-6 text-lg font-bold rounded-2xl shadow-lg
                       bg-gradient-to-r from-violet-500 to-indigo-500
                       hover:from-violet-600 hover:to-indigo-600
                       text-white transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-violet-400 focus:ring-offset-2"
            >
              🚀 Start Quiz
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

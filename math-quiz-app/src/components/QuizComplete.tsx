'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/store/quizStore';
import { PerformanceStats } from './PerformanceStats';

export const QuizComplete = () => {
  const { score, resetQuiz, numberOfQuestions } = useQuizStore();
  const percentage = Math.round((score / numberOfQuestions) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="bg-white/90 backdrop-blur dark:bg-gray-800/90 p-8 rounded-3xl shadow-xl max-w-2xl w-full border-4 border-violet-200 dark:border-violet-800"
      >
        <motion.h1 
          className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", bounce: 0.6 }}
        >
          {percentage >= 80 ? '🎉 Amazing Job!' : 
           percentage >= 60 ? '👏 Well Done!' : 
           percentage >= 40 ? '💪 Good Effort!' : '🌟 Keep Practicing!'}
        </motion.h1>

        <div className="text-2xl text-center mb-8 text-violet-700 dark:text-violet-300">
          You scored {score} out of {numberOfQuestions}!
        </div>

        <PerformanceStats showTitle={false} />

        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetQuiz}
            className="px-8 py-4 text-lg font-bold rounded-2xl shadow-lg
                     bg-gradient-to-r from-violet-500 to-indigo-500
                     hover:from-violet-600 hover:to-indigo-600
                     text-white transition-all duration-300
                     focus:outline-none focus:ring-4 focus:ring-violet-400 focus:ring-offset-2"
          >
            🚀 Try Another Quiz
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

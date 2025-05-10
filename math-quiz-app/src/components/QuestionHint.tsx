'use client';

import { motion } from 'framer-motion';

interface QuestionHintProps {
  hint: string;
}

export const QuestionHint = ({ hint }: QuestionHintProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-800 
                 rounded-xl p-4 mt-4 text-yellow-800 dark:text-yellow-200"
    >
      <div className="flex items-start space-x-3">
        <span className="text-2xl">💡</span>
        <p className="text-lg">{hint}</p>
      </div>
    </motion.div>
  );
};

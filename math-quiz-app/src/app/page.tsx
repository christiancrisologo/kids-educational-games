'use client';

import { QuizComponent } from '@/components/QuizComponent';
import { QuizSetup } from '@/components/QuizSetup';
import { useQuizStore } from '@/store/quizStore';

export default function Home() {
  const { isConfigured } = useQuizStore();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {isConfigured ? <QuizComponent /> : <QuizSetup />}
    </div>
  );
}

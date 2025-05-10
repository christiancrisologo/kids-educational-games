'use client';

import { useEffect } from 'react';
import { useQuizStore } from '@/store/quizStore';
import { motion, AnimatePresence } from 'framer-motion';
import confetti, { Options as ConfettiOptions } from 'canvas-confetti';

import { QuestionExplanation } from './QuestionExplanation';
import { QuizComplete } from './QuizComplete';
import { QuestionHint } from './QuestionHint';

export const QuizComponent = () => {
  const {
    level,
    numberOfQuestions,
    currentProblem,
    score,
    questionsAnswered,
    isCorrect,
    timeRemaining,
    generateProblem,
    checkAnswer,
    resetQuiz,
    streak,
    showExplanation,
    isPracticeModeEnabled,
    togglePracticeMode,
    showHints,
  } = useQuizStore();

  useEffect(() => {
    if (!currentProblem) {
      generateProblem();
    }
  }, [currentProblem, generateProblem]);



  const handleAnswer = (option: number) => {
    if (!currentProblem) return;
    checkAnswer(option);
    if (option === currentProblem.correctAnswer) {
      // Trigger confetti for correct answers
      const duration = 600;
      const particleCount = 50;
      const confettiOptions: ConfettiOptions = {
        particleCount,
        gravity: 0.5,
        angle: 90,
        spread: 45,
        startVelocity: 25,
        origin: { y: 0.7 },
        colors: ['#4ade80', '#60a5fa', '#f472b6'],
        disableForReducedMotion: true,
      };
      confetti(confettiOptions);
    }
  };

  if (questionsAnswered === numberOfQuestions) {
    return <QuizComplete />;
  }

  if (!currentProblem) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="quiz-card mb-8">
          <div className="mb-6">
            <h2 className="quiz-heading text-2xl font-bold mb-4 text-center">Math Quiz</h2>
            
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex space-x-6">
                <div>
                  <span className="font-medium">Question:</span> {questionsAnswered + 1}/{numberOfQuestions}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {timeRemaining}s
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <motion.div
              key={currentProblem.question}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="mb-8"
            >
              <p className="text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200 leading-relaxed">
                {currentProblem.question}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {currentProblem.options.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`quiz-button text-2xl font-semibold py-6 ${isCorrect === null
                    ? 'quiz-button-default shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : isCorrect && option === currentProblem.correctAnswer
                    ? 'quiz-button-correct shadow-lg'
                    : !isCorrect && option === currentProblem.correctAnswer
                    ? 'quiz-button-correct shadow-lg'
                    : !isCorrect && option !== currentProblem.correctAnswer
                    ? 'quiz-button-incorrect opacity-50'
                    : 'quiz-button-default shadow-lg'
                  }`}
                  disabled={isCorrect === true || (isCorrect === false && option === currentProblem.correctAnswer)}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {showHints && currentProblem.hint && (
              <div className="mt-4">
                <QuestionHint hint={currentProblem.hint} />
              </div>
            )}
          </div>

          <AnimatePresence>
            {showExplanation && currentProblem && (
              <QuestionExplanation
                question={currentProblem.question}
                correctAnswer={currentProblem.correctAnswer}
                userAnswer={currentProblem.options.find(opt => opt !== currentProblem.correctAnswer) || 0}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

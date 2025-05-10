'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface QuestionExplanationProps {
  question: string;
  correctAnswer: number;
  userAnswer: number;
}

export const QuestionExplanation: React.FC<QuestionExplanationProps> = ({ question, correctAnswer, userAnswer }) => {
  // Extract numbers and operation from the question
  const matches = question.match(/(\d+)\s*([+\-×÷])\s*(\d+)/);
  if (!matches) return null;

  const [, num1, operator, num2] = matches;
  const number1 = parseInt(num1, 10);
  const number2 = parseInt(num2, 10);

  const getExplanation = () => {
    switch (operator) {
      case '+':
        return (
          <div className="space-y-2">
            <p>Let&apos;s break it down:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Start with {number1}</li>
              <li>Add {number2}</li>
              <li>{number1} + {number2} = {correctAnswer}</li>
            </ol>
          </div>
        );
      case '-':
        return (
          <div className="space-y-2">
            <p>Let&apos;s break it down:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Start with {number1}</li>
              <li>Subtract {number2}</li>
              <li>{number1} - {number2} = {correctAnswer}</li>
            </ol>
          </div>
        );
      case '×':
        return (
          <div className="space-y-2">
            <p>Let&apos;s break it down:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>We need to multiply {number1} by {number2}</li>
              <li>Think of it as adding {number1} to itself {number2} times</li>
              <li>{Array(number2).fill(number1).join(' + ')} = {correctAnswer}</li>
            </ol>
          </div>
        );
      case '÷':
        return (
          <div className="space-y-2">
            <p>Let&apos;s break it down:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>We need to divide {number1} by {number2}</li>
              <li>How many groups of {number2} can we make from {number1}?</li>
              <li>{number1} ÷ {number2} = {correctAnswer}</li>
              <li>To verify: {number2} × {correctAnswer} = {number1}</li>
            </ol>
          </div>
        );
      default:
        return null;
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow mt-4"
    >
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        Explanation
      </h3>
      <p className="text-gray-600 dark:text-gray-400">Let&apos;s solve this step by step:</p>
      <div className="text-gray-600 dark:text-gray-300">
        {getExplanation()}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-400">Let&apos;s check our answer:</p>
          <p className="text-red-500 dark:text-red-400">
            Your answer ({userAnswer}) was incorrect. The correct answer is {correctAnswer}.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Take your time and try to solve step by step!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

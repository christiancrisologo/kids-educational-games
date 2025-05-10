'use client';

import { useQuizStore } from '@/store/quizStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PerformanceStatsProps {
  showTitle?: boolean;
}

export const PerformanceStats = ({ showTitle = true }: PerformanceStatsProps) => {
  const { progress, questionHistory } = useQuizStore();

  // Prepare data for time distribution chart
  const timeData = questionHistory.map((q, index) => ({
    name: `Q${index + 1}`,
    time: q.timeSpent,
    correct: q.isCorrect ? 'Yes' : 'No',
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Performance Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Overall Progress
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Total Quizzes: {progress.totalQuizzesTaken}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Average Score: {Math.round(progress.averageScore * 100) / 100}%
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Longest Streak: {progress.longestStreak}
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Current Quiz Stats
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Correct Answers: {questionHistory.filter(q => q.isCorrect).length}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Average Time: {Math.round(questionHistory.reduce((acc, q) => acc + q.timeSpent, 0) / questionHistory.length)}s
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Points from Streaks: {questionHistory.reduce((acc, q) => acc + (q.scoreEarned > 1 ? q.scoreEarned - 1 : 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
      {showTitle && <h3 className="text-xl font-semibold mb-4">Performance Statistics</h3>}
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Time per Question
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="time">
              {timeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.correct === 'Yes' ? '#4ade80' : '#f87171'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

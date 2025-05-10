import { create } from 'zustand';
import { addDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Level = 'junior' | 'senior';
type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

interface Problem {
  question: string;
  options: number[];
  correctAnswer: number;
}

interface QuestionHistory {
  question: string;
  userAnswer: number;
  correctAnswer: number;
  timeSpent: number;
  isCorrect: boolean;
  scoreEarned: number;
}

interface StudentConfig {
  name: string;
  level: Level;
  numberOfQuestions: number;
  duration: number; // in seconds
  showHints: boolean;
}

interface StudentProgress {
  totalQuizzesTaken: number;
  averageScore: number;
  totalCorrectAnswers: number;
  averageTimePerQuestion: number;
  longestStreak: number;
}

type QuestionType = 'multiple-choice' | 'true-false';

interface Problem {
  question: string;
  options: number[];
  correctAnswer: number;
  type: QuestionType;
  hint: string;
}

interface QuizState extends StudentConfig {
  isConfigured: boolean;
  currentProblem: Problem | null;
  score: number;
  streak: number;
  questionsAnswered: number;
  questionHistory: QuestionHistory[];
  isCorrect: boolean | null;
  timeRemaining: number;
  progress: StudentProgress;
  isPracticeModeEnabled: boolean;
  showExplanation: boolean;
  setConfig: (config: StudentConfig) => void;
  generateProblem: () => void;
  checkAnswer: (answer: number) => void;
  resetQuiz: () => void;
  startQuiz: () => void;

  togglePracticeMode: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: (studentName: string) => Promise<void>;
}

const generateRandomNumber = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateOperation = (): Operation => {
  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
  return operations[Math.floor(Math.random() * operations.length)];
};

const generateProblemForLevel = (level: Level): Problem => {
  const operation = generateOperation();
  let num1, num2, answer, question;

  if (level === 'junior') {
    num1 = generateRandomNumber(1, 20);
    num2 = generateRandomNumber(1, 20);
  } else {
    num1 = generateRandomNumber(10, 50);
    num2 = generateRandomNumber(10, 50);
  }

  switch (operation) {
    case 'addition':
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case 'subtraction':
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;
    case 'multiplication':
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    case 'division':
      // Ensure clean division for junior level
      if (level === 'junior') {
        num2 = generateRandomNumber(1, 10);
        num1 = num2 * generateRandomNumber(1, 10);
      }
      answer = num1 / num2;
      question = `${num1} ÷ ${num2} = ?`;
      break;
  }

  // Generate a wrong option that's close to the correct answer
  const wrongAnswer = answer + (Math.random() < 0.5 ? -2 : 2);
  const options = [answer, wrongAnswer].sort(() => Math.random() - 0.5);

  const hint = `Try breaking down ${num1} ${operation === 'addition' ? '+' : operation === 'subtraction' ? '-' : operation === 'multiplication' ? '×' : '÷'} ${num2} step by step.`;

  return {
    question,
    options,
    correctAnswer: answer,
    type: 'multiple-choice',
    hint,
  };
};

export const useQuizStore = create<QuizState>((set, get) => ({
  name: '',
  level: 'junior',
  numberOfQuestions: 5,
  duration: 30,
  showHints: true,
  isConfigured: false,
  currentProblem: null,
  score: 0,
  streak: 0,
  questionsAnswered: 0,
  questionHistory: [],
  isCorrect: null,
  timeRemaining: 0,
  isPracticeModeEnabled: false,
  showExplanation: false,
  progress: {
    totalQuizzesTaken: 0,
    averageScore: 0,
    totalCorrectAnswers: 0,
    averageTimePerQuestion: 0,
    longestStreak: 0,
  },

  setConfig: (config) => set({ ...config }),

  startQuiz: () => {
    const state = get();
    set({
      isConfigured: true,
      timeRemaining: state.duration,
    });
    get().generateProblem();

    // Start the timer
    const timer = setInterval(() => {
      const currentState = get();
      if (currentState.timeRemaining > 0) {
        set({ timeRemaining: currentState.timeRemaining - 1 });
      } else {
        // Time's up for current question
        if (currentState.questionsAnswered < currentState.numberOfQuestions) {
          set({
            timeRemaining: currentState.duration,
            questionsAnswered: currentState.questionsAnswered + 1,
          });
          currentState.generateProblem();
        }
        clearInterval(timer);
      }
    }, 1000);
  },

  generateProblem: () => {
    const problem = generateProblemForLevel(get().level);
    set({ currentProblem: problem });
  },

  checkAnswer: async (answer) => {
    const state = get();
    const isCorrect = state.currentProblem?.correctAnswer === answer;
    const timeSpent = state.duration - state.timeRemaining;
    
    // Calculate score with bonuses
    let scoreEarned = isCorrect ? 1 : 0;
    if (isCorrect) {
      // Streak bonus
      if (state.streak >= 2) {
        scoreEarned += Math.min(state.streak * 0.5, 3); // Max 3 bonus points
      }
      // Speed bonus
      if (timeSpent < state.duration / 2) {
        scoreEarned += 1;
      }
    }

    const questionHistoryEntry: QuestionHistory = {
      question: state.currentProblem!.question,
      userAnswer: answer,
      correctAnswer: state.currentProblem!.correctAnswer,
      timeSpent,
      isCorrect,
      scoreEarned,
    };

    set((state) => ({
      score: state.score + scoreEarned,
      streak: isCorrect ? state.streak + 1 : 0,
      questionsAnswered: isCorrect ? state.questionsAnswered + 1 : state.questionsAnswered,
      questionHistory: [...state.questionHistory, questionHistoryEntry],
      isCorrect,
      showExplanation: !isCorrect,
    }));

    // Handle correct answers
    if (isCorrect) {
      if (state.questionsAnswered < state.numberOfQuestions - 1) {
        setTimeout(() => {
          get().generateProblem();
          set({ isCorrect: null, showExplanation: false });
        }, 800);
      } else {
        // Save to Firebase if quiz is complete
        await get().saveProgress();
      }
    } else {
      // For incorrect answers, reset isCorrect after a short delay
      setTimeout(() => {
        set({ isCorrect: null });
      }, 800);
    }
  },

  resetQuiz: () => {
    const state = get();
    set({
      isConfigured: false,
      score: 0,
      streak: 0,
      questionsAnswered: 0,
      questionHistory: [],
      currentProblem: null,
      isCorrect: null,
      timeRemaining: 0,
      showExplanation: false,
    });
  },


  togglePracticeMode: () => {
    set((state) => ({
      isPracticeModeEnabled: !state.isPracticeModeEnabled,
      duration: state.isPracticeModeEnabled ? state.duration : 0,
    }));
  },

  saveProgress: async () => {
    const state = get();
    try {
      const newProgress = {
        totalQuizzesTaken: state.progress.totalQuizzesTaken + 1,
        averageScore: (state.progress.averageScore * state.progress.totalQuizzesTaken + state.score) / (state.progress.totalQuizzesTaken + 1),
        totalCorrectAnswers: state.progress.totalCorrectAnswers + state.questionHistory.filter(q => q.isCorrect).length,
        averageTimePerQuestion: state.questionHistory.reduce((acc, q) => acc + q.timeSpent, 0) / state.questionHistory.length,
        longestStreak: Math.max(state.progress.longestStreak, state.streak),
      };

      await addDoc(collection(db, 'student-progress'), {
        name: state.name,
        timestamp: new Date(),
        quizResults: {
          level: state.level,
          score: state.score,
          questionHistory: state.questionHistory,
          streak: state.streak,
        },
        progress: newProgress,
      });

      set({ progress: newProgress });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  loadProgress: async (studentName) => {
    try {
      const progressQuery = await getDocs(
        query(
          collection(db, 'student-progress'),
          where('name', '==', studentName),
          orderBy('timestamp', 'desc'),
          limit(1)
        )
      );

      if (!progressQuery.empty) {
        const latestProgress = progressQuery.docs[0].data();
        set({
          progress: latestProgress.progress,
        });
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  },
}));

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import QuestionDisplay from '@/components/quiz/QuestionDisplay';
import AnswerOptionsList from '@/components/quiz/AnswerOptionsList';
import ScoreDisplay from '@/components/quiz/ScoreDisplay';
import QuizTimer from '@/components/quiz/QuizTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { Question, AnswerOption as AnswerOptionType } from '@/types/quiz';
import { ArrowRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const initialQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    options: [
      { id: 'q1o1', text: 'Berlin' },
      { id: 'q1o2', text: 'Madrid' },
      { id: 'q1o3', text: 'Paris' },
      { id: 'q1o4', text: 'Rome' },
    ],
    correctAnswerId: 'q1o3',
  },
  {
    id: 'q2',
    text: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'q2o1', text: 'Earth' },
      { id: 'q2o2', text: 'Mars' },
      { id: 'q2o3', text: 'Jupiter' },
      { id: 'q2o4', text: 'Saturn' },
    ],
    correctAnswerId: 'q2o2',
  },
  {
    id: 'q3',
    text: 'Who painted the Mona Lisa?',
    options: [
      { id: 'q3o1', text: 'Vincent van Gogh' },
      { id: 'q3o2', text: 'Pablo Picasso' },
      { id: 'q3o3', text: 'Leonardo da Vinci' },
      { id: 'q3o4', text: 'Claude Monet' },
    ],
    correctAnswerId: 'q3o3',
  },
];

const QUESTION_TIME_LIMIT = 15; // seconds
const POINTS_PER_CORRECT_ANSWER = 10;

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [timerKey, setTimerKey] = useState(Date.now()); // Used to reset timer

  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = useCallback((optionId: string) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(optionId);
  }, [isAnswerRevealed]);

  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer) {
      toast({
        title: "No Answer Selected",
        description: "Please select an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsAnswerRevealed(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerId;

    if (isCorrect) {
      setScore((prevScore) => prevScore + POINTS_PER_CORRECT_ANSWER);
      toast({
        title: "Correct!",
        description: `You earned ${POINTS_PER_CORRECT_ANSWER} points.`,
        action: <CheckCircle className="text-green-500" />,
      });
    } else {
      toast({
        title: "Incorrect!",
        description: "Better luck next time.",
        variant: "destructive",
        action: <XCircle className="text-red-500" />,
      });
    }
  }, [selectedAnswer, currentQuestion, toast]);


  const handleTimeUp = useCallback(() => {
    if (!isAnswerRevealed) {
       toast({
        title: "Time's Up!",
        description: "You ran out of time for this question.",
        variant: "destructive",
      });
      setIsAnswerRevealed(true); // Reveal answer even if time is up
      // If no answer was selected, it's considered incorrect.
      // If an answer was selected before time up, it will be evaluated by handleSubmit.
      // This logic implies that an answer must be "submitted" or locked in before time is up.
      // For Kahoot style, selection is submission.
      // For this, we'll treat selection as tentative until submit or time up.
      // If user selected something, process it.
      if (selectedAnswer) {
        handleSubmitAnswer();
      }
    }
  }, [isAnswerRevealed, toast, selectedAnswer, handleSubmitAnswer]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setTimerKey(Date.now()); // Reset timer for the new question
    } else {
      setIsQuizOver(true);
      toast({
        title: "Quiz Finished!",
        description: `Your final score is ${score}.`,
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsAnswerRevealed(false);
    setIsQuizOver(false);
    setTimerKey(Date.now());
     // Optional: shuffle questions
    setQuestions(prevQuestions => [...prevQuestions].sort(() => Math.random() - 0.5).map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    })));
  };
  
  // Auto-submit on selection (Kahoot style)
  useEffect(() => {
    if (selectedAnswer && !isAnswerRevealed) {
      handleSubmitAnswer();
    }
  }, [selectedAnswer, isAnswerRevealed, handleSubmitAnswer]);


  if (isQuizOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-indigo-100 p-4 sm:p-8">
        <Card className="w-full max-w-md text-center shadow-2xl border-2 border-accent">
          <CardContent className="p-6 sm:p-10">
            <h1 className="text-4xl font-bold text-primary mb-4">Quiz Finished!</h1>
            <p className="text-2xl text-foreground mb-2">Your Final Score:</p>
            <p className="text-6xl font-extrabold text-accent mb-8">{score}</p>
            <Button onClick={handleRestartQuiz} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    // This case should ideally not be reached if questions array is always populated
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-background to-indigo-100 p-4 sm:p-8">
      <header className="w-full max-w-3xl mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
          Quiz<span className="text-accent">Whiz</span>
        </h1>
        <ScoreDisplay score={score} />
      </header>

      <main className="w-full max-w-3xl space-y-6 sm:space-y-8">
        <QuizTimer
          key={timerKey}
          initialTime={QUESTION_TIME_LIMIT}
          onTimeUp={handleTimeUp}
          isPaused={isAnswerRevealed}
        />
        <QuestionDisplay
          questionText={currentQuestion.text}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
        <AnswerOptionsList
          options={currentQuestion.options}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correctAnswerId}
          onSelectAnswer={handleSelectAnswer}
          isRevealed={isAnswerRevealed}
          disabled={isAnswerRevealed}
        />
        {isAnswerRevealed && (
          <Button
            onClick={handleNextQuestion}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6 sm:mt-8 !bg-accent hover:!bg-accent/90"
            aria-label="Next Question"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </main>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} QuizWhiz by Firebase Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { TimerIcon } from 'lucide-react';

interface QuizTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isPaused: boolean;
  timerKey: number; // Add a key to reset the timer
}

const QuizTimer: React.FC<QuizTimerProps> = ({ initialTime, onTimeUp, isPaused, timerKey }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime); // Reset time when timerKey changes
  }, [timerKey, initialTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    if (isPaused) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp, isPaused]);

  const progressPercentage = (timeLeft / initialTime) * 100;

  return (
    <div className="w-full p-4 bg-card rounded-lg shadow-md border border-primary/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-primary">
          <TimerIcon className="h-5 w-5 mr-2 text-secondary" />
          <span className="text-sm font-medium">Time Remaining</span>
        </div>
        <span className="text-lg font-semibold text-accent">
          {timeLeft}s
        </span>
      </div>
      <Progress value={progressPercentage} className="w-full h-3 [&>div]:bg-secondary" />
    </div>
  );
};

export default QuizTimer;
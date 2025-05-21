"use client";

import type React from 'react';
import AnswerOption from './AnswerOption';
import type { AnswerOption as AnswerOptionType } from '@/types/quiz';

interface AnswerOptionsListProps {
  options: AnswerOptionType[];
  selectedAnswer: string | null;
  correctAnswer: string | null;
  onSelectAnswer: (optionId: string) => void;
  isRevealed: boolean;
  disabled: boolean;
}

const AnswerOptionsList: React.FC<AnswerOptionsListProps> = ({
  options,
  selectedAnswer,
  correctAnswer,
  onSelectAnswer,
  isRevealed,
  disabled,
}) => {
  const optionKeys = ["A", "B", "C", "D"]; // Or generate dynamically if more options

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {options.map((option, index) => (
        <AnswerOption
          key={option.id}
          optionKey={optionKeys[index]}
          optionText={option.text}
          isSelected={selectedAnswer === option.id}
          isCorrect={correctAnswer === option.id}
          isRevealed={isRevealed}
          onSelect={() => onSelectAnswer(option.id)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default AnswerOptionsList;
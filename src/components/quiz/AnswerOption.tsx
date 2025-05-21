"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Radio } from 'lucide-react';

interface AnswerOptionProps {
  optionText: string;
  isSelected: boolean;
  isCorrect?: boolean; // Undefined until revealed
  isRevealed: boolean;
  onSelect: () => void;
  disabled: boolean;
  optionKey: string; // e.g., "A", "B", "C", "D"
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  optionText,
  isSelected,
  isCorrect,
  isRevealed,
  onSelect,
  disabled,
  optionKey,
}) => {
  const getVariant = () => {
    if (isRevealed) {
      if (isCorrect) return 'success';
      if (isSelected && !isCorrect) return 'destructive';
    }
    return isSelected ? 'secondary' : 'outline';
  };

  const variant = getVariant();

  const Icon = () => {
    if (isRevealed) {
      if (isCorrect) return <CheckCircle className="h-5 w-5 text-green-500" />;
      if (isSelected && !isCorrect) return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (isSelected) return <Radio className="h-5 w-5 text-primary-foreground" />;
    return <Radio className="h-5 w-5 text-muted-foreground group-hover:text-secondary-foreground" />;
  };

  return (
    <Button
      variant={variant as any} // Types for custom variants might need adjustment or explicit mapping
      className={cn(
        "w-full justify-start text-left h-auto py-4 px-6 text-base font-medium group transition-all duration-200 ease-in-out transform hover:scale-[1.02]",
        {
          'bg-green-100 border-green-500 text-green-700 hover:bg-green-200': variant === 'success',
          'bg-red-100 border-red-500 text-red-700 hover:bg-red-200': variant === 'destructive' && isSelected,
          'bg-secondary text-secondary-foreground hover:bg-secondary/90': variant === 'secondary' && isSelected,
          'border-primary/30 hover:bg-accent/10 hover:border-secondary': variant === 'outline' && !isSelected,
          'opacity-70 cursor-not-allowed': disabled && !isRevealed,
        }
      )}
      onClick={onSelect}
      disabled={disabled || isRevealed}
      aria-pressed={isSelected}
    >
      <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-current text-sm font-semibold">
        {optionKey}
      </span>
      <span className="flex-1">{optionText}</span>
      <Icon />
    </Button>
  );
};

export default AnswerOption;
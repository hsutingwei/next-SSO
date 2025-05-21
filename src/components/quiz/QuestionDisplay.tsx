"use client";

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

interface QuestionDisplayProps {
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questionText, questionNumber, totalQuestions }) => {
  return (
    <Card className="w-full shadow-xl bg-card border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <FileQuestion className="mr-3 h-6 w-6 text-secondary" />
            Question {questionNumber} <span className="text-muted-foreground text-base font-normal ml-1">of {totalQuestions}</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-medium text-foreground leading-relaxed">
          {questionText}
        </p>
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
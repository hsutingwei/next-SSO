"use client";

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <Card className="w-full md:w-auto shadow-lg bg-card border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary flex items-center">
          <Award className="mr-2 h-5 w-5 text-accent" />
          Your Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-accent text-center">
          {score}
        </p>
      </CardContent>
    </Card>
  );
};

export default ScoreDisplay;
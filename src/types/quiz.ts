export interface AnswerOption {
    id: string;
    text: string;
}
  
export interface Question {
    id: string;
    text: string;
    options: AnswerOption[];
    correctAnswerId: string;
}  
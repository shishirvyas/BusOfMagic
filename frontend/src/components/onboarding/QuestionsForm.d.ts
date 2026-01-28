interface Answer {
    questionId: number;
    answerText?: string;
    answerArray?: string[];
    ratingScore?: number;
}
interface QuestionsFormProps {
    candidateId: number;
    onAnswersChange: (answers: Answer[]) => void;
    onValidationChange: (isValid: boolean) => void;
}
export default function QuestionsForm({ candidateId, onAnswersChange, onValidationChange }: QuestionsFormProps): import("react/jsx-runtime").JSX.Element;
export {};

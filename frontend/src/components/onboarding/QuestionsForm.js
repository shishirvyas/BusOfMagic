import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, RadioGroup, Radio, FormControlLabel, Checkbox, FormGroup, Rating, Card, CardContent, CircularProgress, Alert, Chip, } from '@mui/material';
export default function QuestionsForm({ candidateId, onAnswersChange, onValidationChange }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchQuestions();
    }, []);
    useEffect(() => {
        // Convert Map to array and send to parent
        const answersArray = Array.from(answers.values());
        onAnswersChange(answersArray);
        // Validate all mandatory questions are answered
        const mandatoryQuestions = questions.filter(q => q.isMandatory);
        const allMandatoryAnswered = mandatoryQuestions.every(q => {
            const answer = answers.get(q.id);
            if (!answer)
                return false;
            switch (q.questionType) {
                case 'TEXT':
                    return answer.answerText && answer.answerText.trim() !== '';
                case 'SINGLE_CHOICE':
                    return answer.answerText && answer.answerText.trim() !== '';
                case 'MULTIPLE_CHOICE':
                    return answer.answerArray && answer.answerArray.length > 0;
                case 'RATING':
                    return answer.ratingScore && answer.ratingScore > 0;
                default:
                    return false;
            }
        });
        onValidationChange(allMandatoryAnswered);
    }, [answers, questions]);
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/onboarding/questions');
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            setQuestions(data.questions || []);
            // Also fetch existing answers if any
            await fetchExistingAnswers();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load questions');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchExistingAnswers = async () => {
        try {
            const response = await fetch(`/api/onboarding/answers/${candidateId}`);
            if (response.ok) {
                const data = await response.json();
                const existingAnswers = new Map();
                data.answers?.forEach((a) => {
                    existingAnswers.set(a.questionId, a);
                });
                setAnswers(existingAnswers);
            }
        }
        catch (err) {
            // Silent fail - answers might not exist yet
            console.log('No existing answers found');
        }
    };
    const updateAnswer = (questionId, answer) => {
        setAnswers(prev => {
            const newAnswers = new Map(prev);
            const existing = newAnswers.get(questionId) || { questionId };
            newAnswers.set(questionId, { ...existing, ...answer });
            return newAnswers;
        });
    };
    const handleTextChange = (questionId, value) => {
        updateAnswer(questionId, { answerText: value });
    };
    const handleSingleChoiceChange = (questionId, value) => {
        updateAnswer(questionId, { answerText: value });
    };
    const handleMultipleChoiceChange = (questionId, option, checked) => {
        setAnswers(prev => {
            const newAnswers = new Map(prev);
            const existing = newAnswers.get(questionId) || { questionId, answerArray: [] };
            let answerArray = existing.answerArray || [];
            if (checked) {
                answerArray = [...answerArray, option];
            }
            else {
                answerArray = answerArray.filter(a => a !== option);
            }
            newAnswers.set(questionId, { ...existing, answerArray });
            return newAnswers;
        });
    };
    const handleRatingChange = (questionId, value) => {
        updateAnswer(questionId, { ratingScore: value || 0 });
    };
    const renderQuestion = (question) => {
        const answer = answers.get(question.id);
        return (_jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1, mb: 1 }, children: [_jsx(Typography, { variant: "subtitle1", fontWeight: 600, children: question.questionText }), question.isMandatory && (_jsx(Chip, { label: "Required", size: "small", color: "error", variant: "outlined" }))] }), question.description && (_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: question.description })), question.questionCategory && (_jsx(Chip, { label: question.questionCategory, size: "small", sx: { mb: 1 } }))] }), question.questionType === 'TEXT' && (_jsx(TextField, { fullWidth: true, multiline: true, rows: 3, placeholder: question.placeholderText || 'Type your answer...', value: answer?.answerText || '', onChange: (e) => handleTextChange(question.id, e.target.value), helperText: question.helpText })), question.questionType === 'SINGLE_CHOICE' && question.options && (_jsx(RadioGroup, { value: answer?.answerText || '', onChange: (e) => handleSingleChoiceChange(question.id, e.target.value), children: question.options.map((option, idx) => (_jsx(FormControlLabel, { value: option, control: _jsx(Radio, {}), label: option }, idx))) })), question.questionType === 'MULTIPLE_CHOICE' && question.options && (_jsx(FormGroup, { children: question.options.map((option, idx) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: answer?.answerArray?.includes(option) || false, onChange: (e) => handleMultipleChoiceChange(question.id, option, e.target.checked) }), label: option }, idx))) })), question.questionType === 'RATING' && (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(Rating, { value: answer?.ratingScore || 0, max: 10, onChange: (_, value) => handleRatingChange(question.id, value), size: "large" }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [answer?.ratingScore || 0, " / 10"] })] })), question.helpText && question.questionType !== 'TEXT' && (_jsx(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 1, display: 'block' }, children: question.helpText }))] }) }, question.id));
    };
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 4 }, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }));
    }
    if (questions.length === 0) {
        return (_jsx(Alert, { severity: "info", sx: { mb: 2 }, children: "No questions available at this time." }));
    }
    // Group questions by category
    const categories = [...new Set(questions.map(q => q.questionCategory))];
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 3 }, children: "Please answer the following questions" }), categories.map(category => {
                const categoryQuestions = questions.filter(q => q.questionCategory === category);
                return (_jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "subtitle1", fontWeight: 600, color: "primary", sx: { mb: 2 }, children: category }), categoryQuestions.map(renderQuestion)] }, category));
            })] }));
}

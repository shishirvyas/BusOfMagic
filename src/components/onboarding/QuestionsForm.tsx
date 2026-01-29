import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Rating,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material'

interface Question {
  id: number
  questionText: string
  questionType: 'TEXT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'RATING'
  questionCategory: string
  description?: string
  options?: string[]
  isMandatory: boolean
  helpText?: string
  placeholderText?: string
}

interface Answer {
  questionId: number
  answerText?: string
  answerArray?: string[]
  ratingScore?: number
}

interface QuestionsFormProps {
  candidateId: number
  onAnswersChange: (answers: Answer[]) => void
  onValidationChange: (isValid: boolean) => void
}

export default function QuestionsForm({ candidateId, onAnswersChange, onValidationChange }: QuestionsFormProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    // Convert Map to array and send to parent
    const answersArray = Array.from(answers.values())
    onAnswersChange(answersArray)
    
    // Validate all mandatory questions are answered
    const mandatoryQuestions = questions.filter(q => q.isMandatory)
    const allMandatoryAnswered = mandatoryQuestions.every(q => {
      const answer = answers.get(q.id)
      if (!answer) return false
      
      switch (q.questionType) {
        case 'TEXT':
          return answer.answerText && answer.answerText.trim() !== ''
        case 'SINGLE_CHOICE':
          return answer.answerText && answer.answerText.trim() !== ''
        case 'MULTIPLE_CHOICE':
          return answer.answerArray && answer.answerArray.length > 0
        case 'RATING':
          return answer.ratingScore && answer.ratingScore > 0
        default:
          return false
      }
    })
    
    onValidationChange(allMandatoryAnswered)
  }, [answers, questions])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/onboarding/questions')
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }
      
      const data = await response.json()
      setQuestions(data.questions || [])
      
      // Also fetch existing answers if any
      await fetchExistingAnswers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const fetchExistingAnswers = async () => {
    try {
      const response = await fetch(`/api/onboarding/answers/${candidateId}`)
      
      if (response.ok) {
        const data = await response.json()
        const existingAnswers = new Map<number, Answer>()
        
        data.answers?.forEach((a: Answer) => {
          existingAnswers.set(a.questionId, a)
        })
        
        setAnswers(existingAnswers)
      }
    } catch (err) {
      // Silent fail - answers might not exist yet
      console.log('No existing answers found')
    }
  }

  const updateAnswer = (questionId: number, answer: Partial<Answer>) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev)
      const existing = newAnswers.get(questionId) || { questionId }
      newAnswers.set(questionId, { ...existing, ...answer })
      return newAnswers
    })
  }

  const handleTextChange = (questionId: number, value: string) => {
    updateAnswer(questionId, { answerText: value })
  }

  const handleSingleChoiceChange = (questionId: number, value: string) => {
    updateAnswer(questionId, { answerText: value })
  }

  const handleMultipleChoiceChange = (questionId: number, option: string, checked: boolean) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev)
      const existing = newAnswers.get(questionId) || { questionId, answerArray: [] }
      let answerArray = existing.answerArray || []
      
      if (checked) {
        answerArray = [...answerArray, option]
      } else {
        answerArray = answerArray.filter(a => a !== option)
      }
      
      newAnswers.set(questionId, { ...existing, answerArray })
      return newAnswers
    })
  }

  const handleRatingChange = (questionId: number, value: number | null) => {
    updateAnswer(questionId, { ratingScore: value || 0 })
  }

  const renderQuestion = (question: Question) => {
    const answer = answers.get(question.id)
    
    return (
      <Card key={question.id} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {question.questionText}
              </Typography>
              {question.isMandatory && (
                <Chip label="Required" size="small" color="error" variant="outlined" />
              )}
            </Box>
            {question.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {question.description}
              </Typography>
            )}
            {question.questionCategory && (
              <Chip label={question.questionCategory} size="small" sx={{ mb: 1 }} />
            )}
          </Box>

          {question.questionType === 'TEXT' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={question.placeholderText || 'Type your answer...'}
              value={answer?.answerText || ''}
              onChange={(e) => handleTextChange(question.id, e.target.value)}
              helperText={question.helpText}
            />
          )}

          {question.questionType === 'SINGLE_CHOICE' && question.options && (
            <RadioGroup
              value={answer?.answerText || ''}
              onChange={(e) => handleSingleChoiceChange(question.id, e.target.value)}
            >
              {question.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          )}

          {question.questionType === 'MULTIPLE_CHOICE' && question.options && (
            <FormGroup>
              {question.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      checked={answer?.answerArray?.includes(option) || false}
                      onChange={(e) => handleMultipleChoiceChange(question.id, option, e.target.checked)}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          )}

          {question.questionType === 'RATING' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                value={answer?.ratingScore || 0}
                max={10}
                onChange={(_, value) => handleRatingChange(question.id, value)}
                size="large"
              />
              <Typography variant="body2" color="text.secondary">
                {answer?.ratingScore || 0} / 10
              </Typography>
            </Box>
          )}

          {question.helpText && question.questionType !== 'TEXT' && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {question.helpText}
            </Typography>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  if (questions.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No questions available at this time.
      </Alert>
    )
  }

  // Group questions by category
  const categories = [...new Set(questions.map(q => q.questionCategory))]

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Please answer the following questions
      </Typography>
      
      {categories.map(category => {
        const categoryQuestions = questions.filter(q => q.questionCategory === category)
        return (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 2 }}>
              {category}
            </Typography>
            {categoryQuestions.map(renderQuestion)}
          </Box>
        )
      })}
    </Box>
  )
}

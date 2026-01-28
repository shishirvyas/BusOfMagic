import { useState } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import PersonalDetailsForm from '@components/onboarding/PersonalDetailsForm'
import EducationDetailsForm from '@components/onboarding/EducationDetailsForm'
import SkillsForm from '@components/onboarding/SkillsForm'
import ReviewForm from '@components/onboarding/ReviewForm'

type OnboardingStep = 'personal' | 'education' | 'skills' | 'review'

interface OnboardingData {
  // Personal Details
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  pincode: string
  aadhar: string
  pan: string
  bankAccount: string

  // Education Details
  education10th: string
  score10th: string
  education12th: string
  score12th: string
  graduationDegree: string
  graduationField: string
  graduationScore: string

  // Skills
  skills: string[]
  languagesKnown: string[]
  certifications: string[]
}

const STEPS: OnboardingStep[] = ['personal', 'education', 'skills', 'review']

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhar: '',
    pan: '',
    bankAccount: '',
    education10th: '',
    score10th: '',
    education12th: '',
    score12th: '',
    graduationDegree: '',
    graduationField: '',
    graduationScore: '',
    skills: [],
    languagesKnown: [],
    certifications: [],
  })

  const handleNext = async (stepData: Partial<OnboardingData>) => {
    setError('')
    setFormData((prev) => ({ ...prev, ...stepData }))

    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1)
    } else {
      // Submit form
      await handleSubmit(stepData)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1))
  }

  const handleSubmit = async (finalStepData: Partial<OnboardingData>) => {
    setIsLoading(true)
    try {
      const finalData = { ...formData, ...finalStepData }

      // Call backend API
      const response = await fetch('/api/candidates/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })

      if (!response.ok) {
        throw new Error('Failed to onboard candidate')
      }

      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Card sx={{ maxWidth: 500 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>
              ✓ Profile Completed Successfully!
            </Typography>
            <Typography color="textSecondary">
              Redirecting to dashboard...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            We need more details from you
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'textSecondary' }}>
            So we understand and can help you better.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Personal Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Education</StepLabel>
            </Step>
            <Step>
              <StepLabel>Skills</StepLabel>
            </Step>
            <Step>
              <StepLabel>Review & Submit</StepLabel>
            </Step>
          </Stepper>

          {/* Form Content */}
          <Box sx={{ minHeight: 400, mb: 3 }}>
            {activeStep === 0 && (
              <PersonalDetailsForm
                data={formData}
                onNext={handleNext}
                isLoading={isLoading}
              />
            )}
            {activeStep === 1 && (
              <EducationDetailsForm
                data={formData}
                onNext={handleNext}
                isLoading={isLoading}
              />
            )}
            {activeStep === 2 && (
              <SkillsForm
                data={formData}
                onNext={handleNext}
                isLoading={isLoading}
              />
            )}
            {activeStep === 3 && (
              <ReviewForm
                data={formData}
                onNext={handleNext}
                isLoading={isLoading}
              />
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0 || isLoading}
              onClick={handleBack}
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => (window.location.href = '/customers')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              {/* Form button handled by child components */}
            </Box>
          </Box>

          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

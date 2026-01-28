import { useState } from 'react'
import SignupForm from '@components/auth/IndividualSignupForm'
import OTPVerification from '@components/auth/OTPVerification'
import CompleteSignup from '@components/auth/CompleteSignup'

type SignupStep = 'contact' | 'otp' | 'profile'

interface SignupData {
  contact: string
  contactType: 'email' | 'mobile'
  fullName?: string
  dateOfBirth?: string
}

export default function IndividualSignup() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('contact')
  const [signupData, setSignupData] = useState<SignupData>({
    contact: '',
    contactType: 'email',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSendOTP = async (contact: string, contactType: 'email' | 'mobile') => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSignupData({
        contact,
        contactType,
      })
      setCurrentStep('otp')
    } catch (error) {
      console.error('Error sending OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCurrentStep('profile')
    } catch (error) {
      console.error('Error verifying OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteSignup = async (userData: {
    fullName: string
    dateOfBirth: string
    contact: string
    contactType: string
  }) => {
    setIsLoading(true)
    try {
      // Call backend API to save signup data with DOB
      const response = await fetch('http://localhost:8080/api/candidates/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          dateOfBirth: userData.dateOfBirth,
          email: userData.contactType === 'email' ? userData.contact : null,
          mobile: userData.contactType === 'mobile' ? userData.contact : null,
          contactType: userData.contactType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save signup data')
      }

      setSignupData({
        ...signupData,
        fullName: userData.fullName,
        dateOfBirth: userData.dateOfBirth,
      })

      setSuccessMessage(
        `Welcome, ${userData.fullName}! Your account has been created successfully.`
      )

      // Redirect to onboarding after 2 seconds to complete profile
      setTimeout(() => {
        window.location.href = '/onboard'
      }, 2000)
    } catch (error) {
      console.error('Error completing signup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditContact = () => {
    setCurrentStep('contact')
    setSignupData({
      contact: '',
      contactType: 'email',
    })
  }

  // Show success message
  if (successMessage) {
    return (
      <div className="success-page">
        <h1>{successMessage}</h1>
      </div>
    )
  }

  // Render based on current step
  switch (currentStep) {
    case 'contact':
      return <SignupForm onSubmit={handleSendOTP} isLoading={isLoading} />

    case 'otp':
      return (
        <OTPVerification
          contactType={signupData.contactType}
          contact={signupData.contact}
          onVerify={handleVerifyOTP}
          onEdit={handleEditContact}
          isLoading={isLoading}
        />
      )

    case 'profile':
      return (
        <CompleteSignup
          contact={signupData.contact}
          contactType={signupData.contactType}
          onSubmit={handleCompleteSignup}
          isLoading={isLoading}
        />
      )

    default:
      return null
  }
}

import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import SignupForm from '@components/auth/IndividualSignupForm';
import OTPVerification from '@components/auth/OTPVerification';
import CompleteSignup from '@components/auth/CompleteSignup';
import { useError } from '@context/ErrorContext';
import { useAuth } from '@context/AuthContext';
import { apiCall } from '@services/api';
export default function IndividualSignup() {
    const { addError } = useError();
    const { setCandidateData } = useAuth();
    const [currentStep, setCurrentStep] = useState('contact');
    const [signupData, setSignupData] = useState({
        contact: '',
        contactType: 'email',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const handleApiError = (error) => {
        const apiError = error;
        addError('Error', apiError.message || 'An unexpected error occurred. Please try again.');
    };
    const handleSendOTP = async (contact, contactType) => {
        setIsLoading(true);
        try {
            // Convert contactType to backend format (EMAIL or PHONE)
            const backendContactType = contactType === 'email' ? 'EMAIL' : 'PHONE';
            console.log('Sending OTP request:', { contact, contactType: backendContactType });
            const result = await apiCall('POST', '/signup/send-otp', {
                contact,
                contactType: backendContactType,
            });
            console.log('OTP response:', result);
            if (result.error) {
                console.error('OTP Error:', result.error);
                handleApiError(result.error);
                return;
            }
            console.log('Moving to OTP step');
            setSignupData({
                contact,
                contactType,
            });
            setCurrentStep('otp');
        }
        catch (error) {
            console.error('OTP Exception:', error);
            handleApiError(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleVerifyOTP = async (otp) => {
        setIsLoading(true);
        try {
            console.log('Verifying OTP:', otp);
            const result = await apiCall('POST', '/signup/verify-otp', {
                contact: signupData.contact,
                otpCode: otp,
            });
            console.log('OTP verification response:', result);
            if (result.error) {
                console.error('OTP Verification Error:', result.error);
                handleApiError(result.error);
                return;
            }
            // Extract candidateId from response
            const candidateId = result.data?.candidateId;
            if (candidateId) {
                setSignupData({
                    ...signupData,
                    candidateId,
                });
                // Store candidateId in localStorage and context
                localStorage.setItem('candidateId', String(candidateId));
                setCandidateData({
                    candidateId: String(candidateId),
                });
            }
            console.log('OTP verified, moving to profile step');
            setCurrentStep('profile');
        }
        catch (error) {
            console.error('OTP Verification Exception:', error);
            handleApiError(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCompleteSignup = async (userData) => {
        setIsLoading(true);
        try {
            // Save profile details (name and DOB) to backend
            const profileResult = await apiCall('POST', '/signup/profile-details', {
                candidateId: signupData.candidateId,
                firstName: userData.fullName.split(' ')[0],
                lastName: userData.fullName.split(' ').slice(1).join(' '),
                dateOfBirth: userData.dateOfBirth,
            });
            if (profileResult.error) {
                handleApiError(profileResult.error);
                return;
            }
            // Then mark signup as complete using query parameter
            const completeResult = await apiCall('POST', `/signup/complete?candidateId=${signupData.candidateId}`);
            if (completeResult.error) {
                handleApiError(completeResult.error);
                return;
            }
            setSignupData({
                ...signupData,
                fullName: userData.fullName,
                dateOfBirth: userData.dateOfBirth,
            });
            setSuccessMessage(`Welcome, ${userData.fullName}! Your account has been created successfully.`);
            // Redirect to onboarding after 2 seconds to complete profile
            setTimeout(() => {
                window.location.href = '/onboard';
            }, 2000);
        }
        catch (error) {
            handleApiError(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleEditContact = () => {
        setCurrentStep('contact');
        setSignupData({
            contact: '',
            contactType: 'email',
        });
    };
    // Show success message
    if (successMessage) {
        return (_jsx("div", { className: "success-page", children: _jsx("h1", { children: successMessage }) }));
    }
    // Render based on current step
    switch (currentStep) {
        case 'contact':
            return _jsx(SignupForm, { onSubmit: handleSendOTP, isLoading: isLoading });
        case 'otp':
            return (_jsx(OTPVerification, { contactType: signupData.contactType, contact: signupData.contact, onVerify: handleVerifyOTP, onEdit: handleEditContact, isLoading: isLoading }));
        case 'profile':
            return (_jsx(CompleteSignup, { contact: signupData.contact, contactType: signupData.contactType, onSubmit: handleCompleteSignup, isLoading: isLoading }));
        default:
            return null;
    }
}

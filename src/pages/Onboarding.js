import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Card, CardContent, Typography, Alert, CircularProgress, } from '@mui/material';
import PersonalDetailsForm from '@components/onboarding/PersonalDetailsForm';
import EducationDetailsForm from '@components/onboarding/EducationDetailsForm';
import SkillsForm from '@components/onboarding/SkillsForm';
import ReviewForm from '@components/onboarding/ReviewForm';
import QuestionsForm from '@components/onboarding/QuestionsForm';
import { useAuth } from '@context/AuthContext';
const STEPS = ['personal', 'education', 'skills', 'review', 'questions'];
export default function Onboarding() {
    const { candidateId, registrationMethod, registrationContact, firstName: ctxFirstName, lastName: ctxLastName, dateOfBirth: ctxDateOfBirth, setCandidateData } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [isQuestionsValid, setIsQuestionsValid] = useState(false);
    const [formData, setFormData] = useState({
        firstName: ctxFirstName || '',
        lastName: ctxLastName || '',
        email: registrationMethod === 'email' ? registrationContact || '' : '',
        phone: registrationMethod === 'phone' ? registrationContact || '' : '',
        dateOfBirth: ctxDateOfBirth || '',
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
        isFirstNameReadOnly: !!ctxFirstName,
        isLastNameReadOnly: !!ctxLastName,
        isDateOfBirthReadOnly: !!ctxDateOfBirth,
        isPhoneReadOnly: registrationMethod === 'phone',
        isEmailReadOnly: registrationMethod === 'email',
    });
    // Fetch candidate data on mount
    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                setIsLoading(true);
                const id = candidateId || localStorage.getItem('candidateId');
                if (!id) {
                    setFetchError('Candidate ID not found. Please start from signup.');
                    return;
                }
                const response = await fetch(`/api/candidates/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const firstName = data.firstName || ctxFirstName || '';
                    const lastName = data.lastName || ctxLastName || '';
                    const dateOfBirth = data.dateOfBirth || ctxDateOfBirth || '';
                    // Store fetched data in context
                    setCandidateData({
                        candidateId: id,
                        firstName,
                        lastName,
                        dateOfBirth,
                    });
                    setFormData((prev) => ({
                        ...prev,
                        firstName,
                        lastName,
                        dateOfBirth,
                        email: registrationMethod === 'email' ? registrationContact || data.email || '' : data.email || '',
                        phone: registrationMethod === 'phone' ? registrationContact || data.phoneNumber || '' : data.phoneNumber || '',
                        isFirstNameReadOnly: true,
                        isLastNameReadOnly: true,
                        isDateOfBirthReadOnly: true,
                        isPhoneReadOnly: registrationMethod === 'phone',
                        isEmailReadOnly: registrationMethod === 'email',
                    }));
                }
            }
            catch (err) {
                console.error('Error fetching candidate data:', err);
                // Don't treat as error - user can still continue with signup
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCandidateData();
    }, [candidateId, registrationMethod, registrationContact, ctxFirstName, ctxLastName, ctxDateOfBirth, setCandidateData]);
    const handleNext = async (stepData) => {
        setError('');
        setFormData((prev) => ({ ...prev, ...stepData }));
        if (activeStep < STEPS.length - 1) {
            // If we're on review step (index 3), save all data first before moving to questions
            if (activeStep === 3) {
                await handleSaveAllData(stepData);
            }
            setActiveStep((prev) => prev + 1);
        }
        else {
            // On questions step - submit answers and complete
            await handleSubmitQuestions();
        }
    };
    const handleBack = () => {
        setActiveStep((prev) => Math.max(0, prev - 1));
    };
    const handleSaveAllData = async (stepData) => {
        setIsLoading(true);
        try {
            const finalData = { ...formData, ...stepData };
            // Get candidateId from localStorage (set after OTP verification)
            const candId = finalData.candidateId || localStorage.getItem('candidateId');
            if (!candId) {
                throw new Error('Candidate ID not found. Please start from signup.');
            }
            // Step 1: Save Personal Details
            let personalResponse = await fetch('/api/signup/personal-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidateId: Number(candId),
                    firstName: finalData.firstName,
                    lastName: finalData.lastName,
                    email: finalData.email,
                    phone: finalData.phone,
                    dateOfBirth: finalData.dateOfBirth,
                    gender: finalData.gender,
                    address: finalData.address,
                    city: finalData.city,
                    state: finalData.state,
                    pincode: finalData.pincode,
                    aadhar: finalData.aadhar,
                    pan: finalData.pan,
                    bankAccount: finalData.bankAccount,
                }),
            });
            if (!personalResponse.ok) {
                const errorData = await personalResponse.json();
                throw new Error(errorData.message || 'Failed to save personal details');
            }
            // Step 2: Save Education Details
            let educationResponse = await fetch('/api/signup/education-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidateId: Number(candId),
                    education10th: finalData.education10th,
                    score10th: finalData.score10th,
                    education12th: finalData.education12th,
                    score12th: finalData.score12th,
                    graduationDegree: finalData.graduationDegree,
                    graduationField: finalData.graduationField,
                    graduationScore: finalData.graduationScore,
                }),
            });
            if (!educationResponse.ok) {
                const errorData = await educationResponse.json();
                throw new Error(errorData.message || 'Failed to save education details');
            }
            // Step 3: Save Skills and Languages
            let skillsResponse = await fetch('/api/signup/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidateId: Number(candId),
                    skills: finalData.skills.map((skill) => ({
                        skillName: skill,
                        proficiencyLevel: 'INTERMEDIATE',
                    })),
                    languages: finalData.languagesKnown.map((language) => ({
                        languageName: language,
                        proficiencyLevel: 'INTERMEDIATE',
                    })),
                }),
            });
            if (!skillsResponse.ok) {
                const errorData = await skillsResponse.json();
                throw new Error(errorData.message || 'Failed to save skills and languages');
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSubmitQuestions = async () => {
        setIsLoading(true);
        try {
            const candId = formData.candidateId || localStorage.getItem('candidateId');
            if (!candId) {
                throw new Error('Candidate ID not found. Please start from signup.');
            }
            // Submit answers
            if (questionAnswers.length > 0) {
                const answersResponse = await fetch('/api/onboarding/answers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        candidateId: Number(candId),
                        answers: questionAnswers,
                    }),
                });
                if (!answersResponse.ok) {
                    const errorData = await answersResponse.json();
                    throw new Error(errorData.message || 'Failed to save answers');
                }
            }
            // Complete Signup
            let completeResponse = await fetch(`/api/signup/complete?candidateId=${candId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!completeResponse.ok) {
                const errorData = await completeResponse.json();
                throw new Error(errorData.message || 'Failed to complete signup');
            }
            setSuccess(true);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading && !formData.firstName) {
        return (_jsx(Box, { sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
            }, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(CircularProgress, { sx: { mb: 2 } }), _jsx(Typography, { children: "Loading your profile..." })] }) }));
    }
    if (success) {
        return (_jsx(Box, { sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
            }, children: _jsx(Card, { sx: { maxWidth: 600 }, children: _jsxs(CardContent, { sx: { textAlign: 'center', py: 5, px: 4 }, children: [_jsx(Typography, { variant: "h4", color: "success.main", sx: { mb: 2, fontWeight: 600 }, children: "\uD83C\uDF89 Thank You!" }), _jsx(Typography, { variant: "h6", sx: { mb: 3, color: 'text.primary' }, children: "Your profile has been completed successfully!" }), _jsx(Typography, { variant: "body1", sx: { mb: 3, color: 'text.secondary' }, children: "Thank you for registering with Magic Bus. Our team will review your profile and get in touch with you soon." }), _jsxs(Box, { sx: {
                                bgcolor: 'grey.100',
                                borderRadius: 2,
                                p: 3,
                                mb: 3
                            }, children: [_jsx(Typography, { variant: "body1", sx: { mb: 2, fontWeight: 500 }, children: "For more information, visit our website:" }), _jsx(Button, { variant: "contained", color: "primary", href: "https://www.magicbus.org/", target: "_blank", rel: "noopener noreferrer", sx: { mb: 2 }, children: "Visit Magic Bus" }), _jsx(Typography, { variant: "body2", sx: { mt: 2, color: 'text.secondary' }, children: "Or contact us for more details:" }), _jsxs(Typography, { variant: "body1", sx: { mt: 1 }, children: ["\uD83D\uDCE7 Email: ", _jsx("a", { href: "mailto:info@magicbus.org", style: { color: '#1976d2' }, children: "info@magicbus.org" })] }), _jsxs(Typography, { variant: "body1", sx: { mt: 0.5 }, children: ["\uD83D\uDCDE Phone: ", _jsx("a", { href: "tel:+911234567890", style: { color: '#1976d2' }, children: "+91 1234 567 890" })] })] }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "We look forward to helping you achieve your goals!" })] }) }) }));
    }
    return (_jsx(Box, { sx: { maxWidth: 900, mx: 'auto' }, children: _jsx(Card, { children: _jsxs(CardContent, { sx: { p: 4 }, children: [_jsx(Typography, { variant: "h4", sx: { mb: 1, fontWeight: 600 }, children: "We need more details from you" }), _jsx(Typography, { variant: "body1", sx: { mb: 3, color: 'textSecondary' }, children: "So we understand and can help you better." }), fetchError && (_jsx(Alert, { severity: "warning", sx: { mb: 3 }, children: fetchError })), error && (_jsx(Alert, { severity: "error", sx: { mb: 3 }, children: error })), _jsxs(Stepper, { activeStep: activeStep, sx: { mb: 4 }, children: [_jsx(Step, { children: _jsx(StepLabel, { children: "Personal Details" }) }), _jsx(Step, { children: _jsx(StepLabel, { children: "Education" }) }), _jsx(Step, { children: _jsx(StepLabel, { children: "Skills" }) }), _jsx(Step, { children: _jsx(StepLabel, { children: "Review" }) }), _jsx(Step, { children: _jsx(StepLabel, { children: "Questions" }) })] }), _jsxs(Box, { sx: { minHeight: 400, mb: 3 }, children: [activeStep === 0 && (_jsx(PersonalDetailsForm, { data: formData, onNext: handleNext, isLoading: isLoading })), activeStep === 1 && (_jsx(EducationDetailsForm, { data: formData, onNext: handleNext, isLoading: isLoading })), activeStep === 2 && (_jsx(SkillsForm, { data: formData, onNext: handleNext, isLoading: isLoading })), activeStep === 3 && (_jsx(ReviewForm, { data: formData, onNext: handleNext, isLoading: isLoading })), activeStep === 4 && (_jsxs(Box, { children: [_jsx(QuestionsForm, { candidateId: Number(formData.candidateId || localStorage.getItem('candidateId')), onAnswersChange: setQuestionAnswers, onValidationChange: setIsQuestionsValid }), _jsx(Box, { sx: { display: 'flex', justifyContent: 'flex-end', mt: 3 }, children: _jsx(Button, { variant: "contained", color: "primary", onClick: () => handleSubmitQuestions(), disabled: isLoading || !isQuestionsValid, children: isLoading ? 'Submitting...' : 'Submit & Complete' }) })] }))] }), _jsxs(Box, { sx: { display: 'flex', gap: 2, justifyContent: 'space-between' }, children: [_jsx(Button, { disabled: activeStep === 0 || isLoading, onClick: handleBack, children: "Back" }), _jsx(Box, { sx: { display: 'flex', gap: 2 }, children: _jsx(Button, { variant: "outlined", onClick: () => (window.location.href = '/customers'), disabled: isLoading, children: "Cancel" }) })] }), isLoading && (_jsx(Box, { sx: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }, children: _jsx(CircularProgress, {}) }))] }) }) }));
}

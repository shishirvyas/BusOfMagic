import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [candidateId, setCandidateId] = useState(localStorage.getItem('candidateId'));
    const [registrationMethod, setRegistrationMethod] = useState(localStorage.getItem('registrationMethod') || null);
    const [registrationContact, setRegistrationContact] = useState(localStorage.getItem('registrationContact'));
    const [firstName, setFirstName] = useState(localStorage.getItem('firstName'));
    const [lastName, setLastName] = useState(localStorage.getItem('lastName'));
    const [dateOfBirth, setDateOfBirth] = useState(localStorage.getItem('dateOfBirth'));
    const setCandidateData = (data) => {
        if (data.candidateId !== undefined) {
            setCandidateId(data.candidateId);
            if (data.candidateId) {
                localStorage.setItem('candidateId', data.candidateId);
            }
            else {
                localStorage.removeItem('candidateId');
            }
        }
        if (data.registrationMethod !== undefined) {
            setRegistrationMethod(data.registrationMethod);
            if (data.registrationMethod) {
                localStorage.setItem('registrationMethod', data.registrationMethod);
            }
            else {
                localStorage.removeItem('registrationMethod');
            }
        }
        if (data.registrationContact !== undefined) {
            setRegistrationContact(data.registrationContact);
            if (data.registrationContact) {
                localStorage.setItem('registrationContact', data.registrationContact);
            }
            else {
                localStorage.removeItem('registrationContact');
            }
        }
        if (data.firstName !== undefined) {
            setFirstName(data.firstName);
            if (data.firstName) {
                localStorage.setItem('firstName', data.firstName);
            }
            else {
                localStorage.removeItem('firstName');
            }
        }
        if (data.lastName !== undefined) {
            setLastName(data.lastName);
            if (data.lastName) {
                localStorage.setItem('lastName', data.lastName);
            }
            else {
                localStorage.removeItem('lastName');
            }
        }
        if (data.dateOfBirth !== undefined) {
            setDateOfBirth(data.dateOfBirth);
            if (data.dateOfBirth) {
                localStorage.setItem('dateOfBirth', data.dateOfBirth);
            }
            else {
                localStorage.removeItem('dateOfBirth');
            }
        }
    };
    const clearCandidateData = () => {
        setCandidateId(null);
        setRegistrationMethod(null);
        setRegistrationContact(null);
        setFirstName(null);
        setLastName(null);
        setDateOfBirth(null);
        localStorage.removeItem('candidateId');
        localStorage.removeItem('registrationMethod');
        localStorage.removeItem('registrationContact');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('dateOfBirth');
    };
    return (_jsx(AuthContext.Provider, { value: {
            candidateId,
            registrationMethod,
            registrationContact,
            firstName,
            lastName,
            dateOfBirth,
            setCandidateData,
            clearCandidateData,
        }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

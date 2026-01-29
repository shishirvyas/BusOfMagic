import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
const ErrorContext = createContext(undefined);
export function ErrorProvider({ children }) {
    const [errors, setErrors] = useState([]);
    const addError = useCallback((title, message, type = 'error') => {
        const id = `${Date.now()}-${Math.random()}`;
        const newError = {
            id,
            title,
            message,
            type,
            timestamp: Date.now(),
        };
        setErrors((prev) => [...prev, newError]);
        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeError(id);
        }, 5000);
    }, []);
    const removeError = useCallback((id) => {
        setErrors((prev) => prev.filter((error) => error.id !== id));
    }, []);
    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);
    return (_jsx(ErrorContext.Provider, { value: { errors, addError, removeError, clearErrors }, children: children }));
}
export function useError() {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within ErrorProvider');
    }
    return context;
}

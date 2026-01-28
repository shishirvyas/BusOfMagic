import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, TextField, Button, Grid, Alert } from '@mui/material';
export default function EducationDetailsForm({ data, onNext, isLoading, }) {
    const [formData, setFormData] = useState({
        education10th: data.education10th || '',
        score10th: data.score10th || '',
        education12th: data.education12th || '',
        score12th: data.score12th || '',
        graduationDegree: data.graduationDegree || '',
        graduationField: data.graduationField || '',
        graduationScore: data.graduationScore || '',
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!formData.education10th.trim())
            newErrors.education10th = '10th education is required';
        if (!formData.score10th.trim())
            newErrors.score10th = '10th score is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };
    const handleSubmit = () => {
        if (validateForm()) {
            onNext(formData);
        }
    };
    return (_jsxs(Box, { children: [Object.keys(errors).length > 0 && (_jsx(Alert, { severity: "error", sx: { mb: 3 }, children: "Please fill all required fields" })), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "10th Education Board/School", value: formData.education10th, onChange: (e) => handleChange('education10th', e.target.value), error: !!errors.education10th, helperText: errors.education10th, placeholder: "CBSE / State Board" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "10th Score / Percentage", value: formData.score10th, onChange: (e) => handleChange('score10th', e.target.value), error: !!errors.score10th, helperText: errors.score10th, placeholder: "85% or 8.5 CGPA" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "12th Education Board/School (Optional)", value: formData.education12th, onChange: (e) => handleChange('education12th', e.target.value), placeholder: "CBSE / State Board" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "12th Score / Percentage (Optional)", value: formData.score12th, onChange: (e) => handleChange('score12th', e.target.value), placeholder: "85% or 8.5 CGPA" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Graduation Degree (Optional)", value: formData.graduationDegree, onChange: (e) => handleChange('graduationDegree', e.target.value), placeholder: "B.Tech, B.A, B.Com, etc" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Field of Study (Optional)", value: formData.graduationField, onChange: (e) => handleChange('graduationField', e.target.value), placeholder: "Computer Science, Commerce, etc" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Graduation Score / CGPA (Optional)", value: formData.graduationScore, onChange: (e) => handleChange('graduationScore', e.target.value), placeholder: "7.5 CGPA" }) }), _jsxs(Grid, { item: true, xs: 12, sx: { display: 'flex', gap: 2, justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "outlined", disabled: isLoading, children: "Back" }), _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: isLoading, size: "large", children: "Next: Skills" })] })] })] }));
}

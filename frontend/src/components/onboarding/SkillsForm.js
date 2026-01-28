import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, TextField, Button, Grid, Chip, Stack, Typography, } from '@mui/material';
const PREDEFINED_SKILLS = [
    'JavaScript',
    'Python',
    'Java',
    'React',
    'Node.js',
    'SQL',
    'HTML/CSS',
    'C++',
    'Data Analysis',
    'Excel',
    'Communication',
    'Leadership',
    'Problem Solving',
    'Digital Marketing',
    'Mobile Development',
];
const PREDEFINED_LANGUAGES = [
    'English',
    'Hindi',
    'Marathi',
    'Tamil',
    'Telugu',
    'Kannada',
    'Bengali',
    'Punjabi',
];
export default function SkillsForm({ data, onNext, isLoading, }) {
    const [formData, setFormData] = useState({
        skills: data.skills || [],
        languagesKnown: data.languagesKnown || [],
        certifications: data.certifications || [],
    });
    const [skillInput, setSkillInput] = useState('');
    const [certInput, setCertInput] = useState('');
    const handleAddSkill = (skill) => {
        const trimmed = skill.trim();
        if (trimmed && !formData.skills.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, trimmed],
            }));
            setSkillInput('');
        }
    };
    const handleRemoveSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };
    const handleAddLanguage = (language) => {
        if (!formData.languagesKnown.includes(language)) {
            setFormData((prev) => ({
                ...prev,
                languagesKnown: [...prev.languagesKnown, language],
            }));
        }
    };
    const handleRemoveLanguage = (language) => {
        setFormData((prev) => ({
            ...prev,
            languagesKnown: prev.languagesKnown.filter((l) => l !== language),
        }));
    };
    const handleAddCertification = (cert) => {
        const trimmed = cert.trim();
        if (trimmed && !formData.certifications.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                certifications: [...prev.certifications, trimmed],
            }));
            setCertInput('');
        }
    };
    const handleRemoveCertification = (cert) => {
        setFormData((prev) => ({
            ...prev,
            certifications: prev.certifications.filter((c) => c !== cert),
        }));
    };
    const handleSubmit = () => {
        onNext(formData);
    };
    return (_jsx(Box, { children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Technical & Professional Skills" }), _jsxs(Stack, { direction: "row", spacing: 1, sx: { mb: 2 }, children: [_jsx(TextField, { size: "small", placeholder: "Type a skill (e.g., JavaScript)", value: skillInput, onChange: (e) => setSkillInput(e.target.value), onKeyPress: (e) => {
                                        if (e.key === 'Enter') {
                                            handleAddSkill(skillInput);
                                            e.preventDefault();
                                        }
                                    }, sx: { flex: 1 } }), _jsx(Button, { variant: "outlined", onClick: () => handleAddSkill(skillInput), disabled: !skillInput.trim(), children: "Add" })] }), _jsx(Typography, { variant: "subtitle2", sx: { mb: 1 }, children: "Suggested Skills:" }), _jsx(Stack, { direction: "row", spacing: 1, sx: { mb: 2, flexWrap: 'wrap' }, children: PREDEFINED_SKILLS.map((skill) => (_jsx(Chip, { label: skill, onClick: () => handleAddSkill(skill), variant: formData.skills.includes(skill) ? 'filled' : 'outlined', color: formData.skills.includes(skill) ? 'primary' : 'default', sx: { m: 0.5 } }, skill))) }), _jsx(Typography, { variant: "subtitle2", sx: { mb: 1 }, children: "Selected Skills:" }), _jsx(Stack, { direction: "row", spacing: 1, sx: { mb: 3, flexWrap: 'wrap' }, children: formData.skills.map((skill) => (_jsx(Chip, { label: skill, onDelete: () => handleRemoveSkill(skill), color: "primary", sx: { m: 0.5 } }, skill))) })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Languages Known" }), _jsx(Stack, { direction: "row", spacing: 1, sx: { mb: 2, flexWrap: 'wrap' }, children: PREDEFINED_LANGUAGES.map((language) => (_jsx(Chip, { label: language, onClick: () => handleAddLanguage(language), variant: formData.languagesKnown.includes(language)
                                    ? 'filled'
                                    : 'outlined', color: formData.languagesKnown.includes(language)
                                    ? 'primary'
                                    : 'default', sx: { m: 0.5 } }, language))) }), _jsx(Typography, { variant: "subtitle2", sx: { mb: 1 }, children: "Selected Languages:" }), _jsx(Stack, { direction: "row", spacing: 1, sx: { mb: 3, flexWrap: 'wrap' }, children: formData.languagesKnown.map((language) => (_jsx(Chip, { label: language, onDelete: () => handleRemoveLanguage(language), color: "primary", sx: { m: 0.5 } }, language))) })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Certifications (Optional)" }), _jsxs(Stack, { direction: "row", spacing: 1, sx: { mb: 2 }, children: [_jsx(TextField, { size: "small", placeholder: "Type a certification (e.g., AWS Certified)", value: certInput, onChange: (e) => setCertInput(e.target.value), onKeyPress: (e) => {
                                        if (e.key === 'Enter') {
                                            handleAddCertification(certInput);
                                            e.preventDefault();
                                        }
                                    }, sx: { flex: 1 } }), _jsx(Button, { variant: "outlined", onClick: () => handleAddCertification(certInput), disabled: !certInput.trim(), children: "Add" })] }), _jsx(Typography, { variant: "subtitle2", sx: { mb: 1 }, children: "Added Certifications:" }), _jsx(Stack, { direction: "row", spacing: 1, sx: { mb: 3, flexWrap: 'wrap' }, children: formData.certifications.map((cert) => (_jsx(Chip, { label: cert, onDelete: () => handleRemoveCertification(cert), color: "success", sx: { m: 0.5 } }, cert))) })] }), _jsxs(Grid, { item: true, xs: 12, sx: { display: 'flex', gap: 2, justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "outlined", disabled: isLoading, children: "Back" }), _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: isLoading, size: "large", children: "Review & Submit" })] })] }) }));
}

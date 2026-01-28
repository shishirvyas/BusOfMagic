import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Alert, Typography, CircularProgress, FormHelperText, } from '@mui/material';
import apiClient from '@services/api';
const MANDATORY_FIELDS = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'dateOfBirth',
    'gender',
    'address',
    'city',
    'state',
    'pincode',
];
export default function PersonalDetailsForm({ data, onNext, isLoading, }) {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);
    const [formData, setFormData] = useState({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        stateId: data.stateId || '',
        cityId: data.cityId || '',
        pincode: data.pincode || '',
        aadhar: data.aadhar || '',
        pan: data.pan || '',
        bankAccount: data.bankAccount || '',
    });
    const [errors, setErrors] = useState({});
    // Fetch states on component mount
    useEffect(() => {
        const fetchStates = async () => {
            try {
                setLoadingStates(true);
                const response = await apiClient.get('/locations/states/active');
                setStates(response.data || []);
            }
            catch (error) {
                console.error('Failed to fetch states:', error);
            }
            finally {
                setLoadingStates(false);
            }
        };
        fetchStates();
    }, []);
    // Fetch cities when state changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!formData.stateId) {
                setCities([]);
                return;
            }
            try {
                setLoadingCities(true);
                const response = await apiClient.get(`/locations/cities/state/${formData.stateId}/active`);
                setCities(response.data || []);
            }
            catch (error) {
                console.error('Failed to fetch cities:', error);
                setCities([]);
            }
            finally {
                setLoadingCities(false);
            }
        };
        fetchCities();
    }, [formData.stateId]);
    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim())
            newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim())
            newErrors.lastName = 'Last name is required';
        if (!formData.email.trim())
            newErrors.email = 'Email is required';
        if (!formData.phone.trim())
            newErrors.phone = 'Phone is required';
        if (!formData.dateOfBirth)
            newErrors.dateOfBirth = 'DOB is required';
        if (!formData.gender)
            newErrors.gender = 'Gender is required';
        if (!formData.address.trim())
            newErrors.address = 'Address is required';
        if (!formData.city.trim())
            newErrors.city = 'City is required';
        if (!formData.state.trim())
            newErrors.state = 'State is required';
        if (!formData.pincode.trim())
            newErrors.pincode = 'Pincode is required';
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
    const handleStateChange = (stateId) => {
        const selectedState = states.find(s => s.id.toString() === stateId);
        setFormData((prev) => ({
            ...prev,
            stateId: stateId,
            state: selectedState?.stateName || '',
            cityId: '', // Reset city when state changes
            city: '',
        }));
        if (errors.state) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated.state;
                return updated;
            });
        }
    };
    const handleCityChange = (cityId) => {
        const selectedCity = cities.find(c => c.id.toString() === cityId);
        setFormData((prev) => ({
            ...prev,
            cityId: cityId,
            city: selectedCity?.cityName || '',
        }));
        if (errors.city) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated.city;
                return updated;
            });
        }
    };
    const handleSubmit = () => {
        if (validateForm()) {
            onNext(formData);
        }
    };
    const renderLabel = (fieldName, label) => {
        const isMandatory = MANDATORY_FIELDS.includes(fieldName);
        return isMandatory ? `${label} *` : label;
    };
    return (_jsxs(Box, { children: [Object.keys(errors).length > 0 && (_jsx(Alert, { severity: "error", sx: { mb: 3 }, children: "Please fill all required fields" })), _jsx(Typography, { variant: "caption", color: "textSecondary", sx: { display: 'block', mb: 2 }, children: "* indicates mandatory field" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: renderLabel('firstName', 'First Name'), value: formData.firstName, onChange: (e) => handleChange('firstName', e.target.value), error: !!errors.firstName, helperText: errors.firstName, placeholder: "John", disabled: data.isFirstNameReadOnly, InputProps: {
                                readOnly: data.isFirstNameReadOnly,
                            } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: renderLabel('lastName', 'Last Name'), value: formData.lastName, onChange: (e) => handleChange('lastName', e.target.value), error: !!errors.lastName, helperText: errors.lastName, placeholder: "Doe", disabled: data.isLastNameReadOnly, InputProps: {
                                readOnly: data.isLastNameReadOnly,
                            } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, type: "email", label: renderLabel('email', 'Email'), value: formData.email, onChange: (e) => handleChange('email', e.target.value), error: !!errors.email, helperText: errors.email || (data.isEmailReadOnly ? 'Read-only from signup' : ''), placeholder: "john@example.com", disabled: data.isEmailReadOnly, InputProps: {
                                readOnly: data.isEmailReadOnly,
                            } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: renderLabel('phone', 'Phone'), value: formData.phone, onChange: (e) => handleChange('phone', e.target.value), error: !!errors.phone, helperText: errors.phone || (data.isPhoneReadOnly ? 'Read-only from signup' : ''), placeholder: "9876543210", disabled: data.isPhoneReadOnly, InputProps: {
                                readOnly: data.isPhoneReadOnly,
                            } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, type: "date", label: renderLabel('dateOfBirth', 'Date of Birth'), value: formData.dateOfBirth, onChange: (e) => handleChange('dateOfBirth', e.target.value), error: !!errors.dateOfBirth, helperText: errors.dateOfBirth || (data.isDateOfBirthReadOnly ? 'Read-only from profile' : ''), InputLabelProps: { shrink: true }, disabled: data.isDateOfBirthReadOnly, inputProps: {
                                readOnly: data.isDateOfBirthReadOnly,
                            } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsxs(FormControl, { fullWidth: true, error: !!errors.gender, children: [_jsx(InputLabel, { children: renderLabel('gender', 'Gender') }), _jsxs(Select, { value: formData.gender, label: renderLabel('gender', 'Gender'), onChange: (e) => handleChange('gender', e.target.value), children: [_jsx(MenuItem, { value: "MALE", children: "Male" }), _jsx(MenuItem, { value: "FEMALE", children: "Female" }), _jsx(MenuItem, { value: "OTHER", children: "Other" })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: renderLabel('address', 'Address'), value: formData.address, onChange: (e) => handleChange('address', e.target.value), error: !!errors.address, helperText: errors.address, placeholder: "123 Main Street", multiline: true, rows: 2 }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsxs(FormControl, { fullWidth: true, error: !!errors.state, children: [_jsx(InputLabel, { children: renderLabel('state', 'State') }), _jsx(Select, { value: formData.stateId, label: renderLabel('state', 'State'), onChange: (e) => handleStateChange(e.target.value), disabled: loadingStates, children: loadingStates ? (_jsxs(MenuItem, { value: "", disabled: true, children: [_jsx(CircularProgress, { size: 20, sx: { mr: 1 } }), " Loading states..."] })) : states.length === 0 ? (_jsx(MenuItem, { value: "", disabled: true, children: "No states available" })) : (states.map((state) => (_jsx(MenuItem, { value: state.id.toString(), children: state.stateName }, state.id)))) }), errors.state && _jsx(FormHelperText, { children: errors.state })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsxs(FormControl, { fullWidth: true, error: !!errors.city, children: [_jsx(InputLabel, { children: renderLabel('city', 'City') }), _jsx(Select, { value: formData.cityId, label: renderLabel('city', 'City'), onChange: (e) => handleCityChange(e.target.value), disabled: !formData.stateId || loadingCities, children: !formData.stateId ? (_jsx(MenuItem, { value: "", disabled: true, children: "Select a state first" })) : loadingCities ? (_jsxs(MenuItem, { value: "", disabled: true, children: [_jsx(CircularProgress, { size: 20, sx: { mr: 1 } }), " Loading cities..."] })) : cities.length === 0 ? (_jsx(MenuItem, { value: "", disabled: true, children: "No cities available" })) : (cities.map((city) => (_jsx(MenuItem, { value: city.id.toString(), children: city.cityName }, city.id)))) }), errors.city && _jsx(FormHelperText, { children: errors.city })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: renderLabel('pincode', 'Pincode'), value: formData.pincode, onChange: (e) => handleChange('pincode', e.target.value), error: !!errors.pincode, helperText: errors.pincode, placeholder: "400001" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "PAN Number (Optional)", value: formData.pan, onChange: (e) => handleChange('pan', e.target.value), placeholder: "ABCDE1234F" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Aadhar Number (Optional)", value: formData.aadhar, onChange: (e) => handleChange('aadhar', e.target.value), placeholder: "1234 5678 9012" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Bank Account (Optional)", value: formData.bankAccount, onChange: (e) => handleChange('bankAccount', e.target.value), placeholder: "Account Number" }) }), _jsx(Grid, { item: true, xs: 12, sx: { display: 'flex', gap: 2, justifyContent: 'flex-end' }, children: _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: isLoading, size: "large", children: "Next: Education" }) })] })] }));
}

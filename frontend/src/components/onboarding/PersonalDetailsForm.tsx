import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'

interface PersonalDetailsFormProps {
  data: any
  onNext: (data: any) => void
  isLoading: boolean
}

export default function PersonalDetailsForm({
  data,
  onNext,
  isLoading,
}: PersonalDetailsFormProps) {
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
    pincode: data.pincode || '',
    aadhar: data.aadhar || '',
    pan: data.pan || '',
    bankAccount: data.bankAccount || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'DOB is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData)
    }
  }

  return (
    <Box>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Please fill all required fields
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            placeholder="John"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            placeholder="Doe"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="john@example.com"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            placeholder="9876543210"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              label="Gender"
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            placeholder="123 Main Street"
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            error={!!errors.city}
            helperText={errors.city}
            placeholder="Mumbai"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            error={!!errors.state}
            helperText={errors.state}
            placeholder="Maharashtra"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => handleChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode}
            placeholder="400001"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Aadhar Number (Optional)"
            value={formData.aadhar}
            onChange={(e) => handleChange('aadhar', e.target.value)}
            placeholder="1234 5678 9012"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="PAN Number (Optional)"
            value={formData.pan}
            onChange={(e) => handleChange('pan', e.target.value)}
            placeholder="ABCDE1234F"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bank Account (Optional)"
            value={formData.bankAccount}
            onChange={(e) => handleChange('bankAccount', e.target.value)}
            placeholder="Account Number"
          />
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            size="large"
          >
            Next: Education
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

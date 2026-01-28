# Onboarding Form - Implementation Quick Reference

## What Was Changed

### New Files Created
1. **`src/context/AuthContext.tsx`** - Context for managing signup data across pages

### Updated Files
1. **`src/App.tsx`** - Added AuthProvider wrapper
2. **`src/pages/Onboarding.tsx`** - Added data fetching and loading logic
3. **`src/pages/auth/IndividualSignup.tsx`** - Store candidateId in context
4. **`src/components/auth/OTPVerification.tsx`** - Store registration method in context
5. **`src/components/auth/CompleteSignup.tsx`** - Store firstName, lastName, dateOfBirth in context
6. **`src/components/onboarding/PersonalDetailsForm.tsx`** - Added mandatory field indicators and read-only logic

## Form Behavior

### Pre-populated Fields (Read-Only)
- **First Name** - From signup step, cannot be changed
- **Last Name** - From signup step, cannot be changed
- **Date of Birth** - From signup step, cannot be changed
- **Email** (if registered with email) - Cannot be changed
- **Phone** (if registered with phone) - Cannot be changed

### User-Editable Fields
- Gender *
- Address *
- City *
- State *
- Pincode *
- Email (if registered with phone)
- Phone (if registered with email)
- PAN Number (optional)
- Aadhar Number (optional)
- Bank Account (optional)

### Mandatory Fields Marked
All mandatory fields show `*` next to the label, with helper text "* indicates mandatory field"

## Key Features

1. **Automatic Population** - Form loads with pre-filled data from signup
2. **Smart Read-Only** - Only allows editing fields that weren't used in signup
3. **Persistent Storage** - Data saved in localStorage for session persistence
4. **Loading State** - Shows spinner while fetching candidate data
5. **Validation** - All mandatory fields must be filled before submission
6. **Helper Text** - Shows why fields are read-only

## Testing the Flow

### Test Case 1: Email Registration
1. Go to /individualsignup
2. Select "Email" and enter email address
3. Complete OTP verification
4. Fill name and DOB
5. Go to /onboard
6. Verify: Email field is read-only, Phone field is editable

### Test Case 2: Phone Registration
1. Go to /individualsignup
2. Select "Mobile" and enter phone number
3. Complete OTP verification
4. Fill name and DOB
5. Go to /onboard
6. Verify: Phone field is read-only, Email field is editable

### Test Case 3: Form Submission
1. Complete above tests
2. Fill all mandatory fields
3. Click "Next: Education"
4. Verify form submits successfully

## Code Examples

### Using AuthContext
```jsx
import { useAuth } from '@context/AuthContext'

function MyComponent() {
  const { candidateId, firstName, registrationMethod, setCandidateData } = useAuth()
  
  // Update data
  setCandidateData({ firstName: 'John' })
  
  // Clear data (on logout)
  // setCandidateData().clearCandidateData()
}
```

### Making Field Read-Only
```jsx
<TextField
  disabled={data.isEmailReadOnly}
  InputProps={{
    readOnly: data.isEmailReadOnly,
  }}
  helperText={data.isEmailReadOnly ? 'Read-only from signup' : ''}
/>
```

### Mandatory Field Label
```jsx
const renderLabel = (fieldName: string, label: string) => {
  const isMandatory = MANDATORY_FIELDS.includes(fieldName)
  return isMandatory ? `${label} *` : label
}

<TextField label={renderLabel('firstName', 'First Name')} />
```

## API Endpoints Used

- **GET** `/api/candidates/{candidateId}` - Fetch candidate profile for pre-population
- **POST** `/api/signup/personal-details` - Save personal details
- **POST** `/api/signup/education-details` - Save education details
- **POST** `/api/signup/skills` - Save skills and languages
- **POST** `/api/signup/complete?candidateId={id}` - Mark signup as complete

## Troubleshooting

### Issue: Fields not pre-populating
- Check if candidateId is in localStorage: `localStorage.getItem('candidateId')`
- Check browser console for API errors
- Verify `/api/candidates/{id}` endpoint returns correct data

### Issue: Fields not read-only
- Check `isFirstNameReadOnly` and other flags in props
- Verify `disabled` and `inputProps.readOnly` are both set

### Issue: Data not persisting
- Check if localStorage is enabled in browser
- Check if AuthProvider wraps the entire app

### Issue: Form validation errors
- Ensure all MANDATORY_FIELDS are filled
- Check that email and phone formats are valid
- Verify date format is YYYY-MM-DD

## Future Enhancements

1. Add API endpoint to edit candidate name/DOB if needed
2. Add "Change" button to allow editing pre-filled fields with verification
3. Add field-level loading states while fetching data
4. Add animations for field state transitions
5. Add more validation rules (email domain whitelist, etc.)
6. Add integration with address validation API

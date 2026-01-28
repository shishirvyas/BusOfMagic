# Onboarding Form Auto-Population - Complete Documentation

## Overview

The onboarding form (`http://localhost:3000/onboard`) now intelligently pre-populates and manages field accessibility based on:
1. **Signup Method** - Whether user registered with email or phone
2. **Profile Data** - Pre-filled customer information from the database
3. **Field Requirements** - Shows mandatory fields with asterisk (*)

## Key Features

### 1. Automatic Data Population
When the onboarding page loads for the first time:
- **First Name** is pre-filled from signup data (read-only)
- **Last Name** is pre-filled from signup data (read-only)
- **Date of Birth** is pre-filled from signup data (read-only)
- **Email or Phone** is pre-filled based on registration method (read-only)
- All other fields remain empty for user to fill

### 2. Smart Read-Only Logic
Based on how the user signed up:
- If signed up with **email**: Email field is read-only, Phone field must be filled
- If signed up with **phone**: Phone field is read-only, Email field must be filled
- Name and DOB are always read-only (set during signup)

### 3. Mandatory Field Indicators
All mandatory fields are marked with an asterisk (*):
```
First Name *
Last Name *
Email *
Phone *
Date of Birth *
Gender *
Address *
City *
State *
Pincode *
```

### 4. Helper Text for Read-Only Fields
- **Email/Phone**: "Read-only from signup" - indicates field was used in registration
- **DOB**: "Read-only from profile" - indicates field was pre-populated from database

## Technical Architecture

### AuthContext (New)
```
Location: src/context/AuthContext.tsx
Purpose: Manage signup data across the entire application
Storage: React Context + localStorage
```

**Manages:**
- `candidateId` - Unique user identifier
- `registrationMethod` - 'email' or 'phone'
- `registrationContact` - The contact used for signup
- `firstName` - User's first name
- `lastName` - User's last name
- `dateOfBirth` - User's date of birth

**Methods:**
- `setCandidateData(data)` - Update any fields
- `clearCandidateData()` - Clear all data

### Data Flow

```
1. SIGNUP PROCESS
   ├─ User enters email or phone
   ├─ OTPVerification saves registrationMethod & registrationContact
   ├─ CompleteSignup saves firstName, lastName, dateOfBirth
   └─ Redirects to /onboard
                    │
                    ▼
2. ONBOARDING LOAD
   ├─ Page mounts
   ├─ Fetches /api/candidates/{candidateId}
   ├─ Pre-populates form fields
   └─ Sets read-only flags based on registrationMethod
                    │
                    ▼
3. USER INTERACTION
   ├─ Edits non-read-only fields
   ├─ Validation ensures all mandatory fields filled
   └─ Submits form
```

## Component Changes

### App.tsx
```jsx
<ErrorProvider>
  <AuthProvider>  {/* NEW - wraps entire app */}
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>...</Routes>
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>
</ErrorProvider>
```

### Onboarding.tsx
```jsx
export default function Onboarding() {
  const {
    candidateId,
    registrationMethod,
    registrationContact,
    firstName: ctxFirstName,
    lastName: ctxLastName,
    dateOfBirth: ctxDateOfBirth,
  } = useAuth()

  // Fetch candidate data on mount
  useEffect(() => {
    const response = await fetch(`/api/candidates/${id}`)
    const data = await response.json()
    // Pre-populate with fetched data
    setFormData(prev => ({
      ...prev,
      firstName: data.firstName,  // read-only
      lastName: data.lastName,    // read-only
      dateOfBirth: data.dateOfBirth,  // read-only
      email: registrationMethod === 'email' 
        ? registrationContact  // read-only
        : data.email,          // editable
      phone: registrationMethod === 'phone'
        ? registrationContact  // read-only
        : data.phoneNumber,    // editable
      isFirstNameReadOnly: true,
      isLastNameReadOnly: true,
      isDateOfBirthReadOnly: true,
      isPhoneReadOnly: registrationMethod === 'phone',
      isEmailReadOnly: registrationMethod === 'email',
    }))
  }, [])
}
```

### PersonalDetailsForm.tsx
```jsx
const MANDATORY_FIELDS = [
  'firstName', 'lastName', 'email', 'phone', 
  'dateOfBirth', 'gender', 'address', 'city', 
  'state', 'pincode'
]

const renderLabel = (fieldName, label) => {
  return MANDATORY_FIELDS.includes(fieldName)
    ? `${label} *`
    : label
}

// In form:
<TextField
  label={renderLabel('firstName', 'First Name')}
  disabled={data.isFirstNameReadOnly}
  InputProps={{ readOnly: data.isFirstNameReadOnly }}
  helperText={data.isFirstNameReadOnly ? 'Read-only from signup' : ''}
/>
```

## User Experience Flow

### Email Registration Path
```
SIGNUP PAGE
├─ User clicks "Email" tab
├─ Enters: john@example.com
├─ Clicks "Send OTP"
          │
VERIFY OTP
├─ Enters OTP code
├─ System saves:
│  ├─ candidateId: 123
│  ├─ registrationMethod: 'email'
│  └─ registrationContact: 'john@example.com'
├─ Clicks "Verify OTP"
          │
COMPLETE SIGNUP
├─ Fills: John, Doe, 01/01/1990
├─ System saves:
│  ├─ firstName: 'John'
│  ├─ lastName: 'Doe'
│  └─ dateOfBirth: '1990-01-01'
├─ Clicks "Complete Registration"
          │
ONBOARDING FORM
├─ Form loads with:
│  ├─ First Name: John [READ-ONLY]
│  ├─ Last Name: Doe [READ-ONLY]
│  ├─ Email: john@example.com [READ-ONLY - from signup]
│  ├─ Phone: [EMPTY - must fill] *
│  ├─ DOB: 01/01/1990 [READ-ONLY]
│  └─ Other fields empty
├─ User fills remaining mandatory fields
└─ Submits form
```

### Phone Registration Path
```
SIGNUP PAGE
├─ User clicks "Mobile" tab
├─ Enters: 9876543210
├─ Clicks "Send OTP"
          │
VERIFY OTP
├─ Enters OTP code
├─ System saves:
│  ├─ candidateId: 456
│  ├─ registrationMethod: 'phone'
│  └─ registrationContact: '9876543210'
├─ Clicks "Verify OTP"
          │
COMPLETE SIGNUP
├─ Fills: Jane, Smith, 02/02/1992
├─ System saves:
│  ├─ firstName: 'Jane'
│  ├─ lastName: 'Smith'
│  └─ dateOfBirth: '1992-02-02'
├─ Clicks "Complete Registration"
          │
ONBOARDING FORM
├─ Form loads with:
│  ├─ First Name: Jane [READ-ONLY]
│  ├─ Last Name: Smith [READ-ONLY]
│  ├─ Email: [EMPTY - must fill] *
│  ├─ Phone: 9876543210 [READ-ONLY - from signup]
│  ├─ DOB: 02/02/1992 [READ-ONLY]
│  └─ Other fields empty
├─ User fills remaining mandatory fields
└─ Submits form
```

## Data Storage

### In Memory (React Context)
```
AuthContext {
  candidateId: '123',
  registrationMethod: 'email',
  registrationContact: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01'
}
```

### In Browser (localStorage)
```
candidateId: "123"
registrationMethod: "email"
registrationContact: "john@example.com"
firstName: "John"
lastName: "Doe"
dateOfBirth: "1990-01-01"
```

### In Database (via API)
```
candidate table:
├─ id: 123
├─ firstName: 'John'
├─ lastName: 'Doe'
├─ email: 'john@example.com'
├─ phoneNumber: NULL (will be filled during onboarding)
├─ dateOfBirth: '1990-01-01'
└─ ... other fields
```

## Validation Rules

### Mandatory Fields (must be filled)
1. **First Name** - Already filled (read-only)
2. **Last Name** - Already filled (read-only)
3. **Email** - Pre-filled if email signup, else required input
4. **Phone** - Pre-filled if phone signup, else required input
5. **Date of Birth** - Already filled (read-only)
6. **Gender** - Required dropdown selection
7. **Address** - Required text input (min 1 char)
8. **City** - Required text input
9. **State** - Required text input
10. **Pincode** - Required text input

### Optional Fields (can be left empty)
- PAN Number
- Aadhar Number
- Bank Account Number

### Validation on Submit
```javascript
if (validateForm()) {
  // Checks:
  // - firstName not empty ✓ (pre-filled)
  // - lastName not empty ✓ (pre-filled)
  // - email not empty ✓ (pre-filled or user input)
  // - phone not empty ✓ (pre-filled or user input)
  // - dateOfBirth selected ✓ (pre-filled)
  // - gender selected
  // - address not empty
  // - city not empty
  // - state not empty
  // - pincode not empty
  onNext(formData)
}
```

## API Endpoints

### GET `/api/candidates/{candidateId}`
**Purpose:** Fetch candidate profile to pre-populate form
**Used in:** Onboarding.tsx useEffect

**Response:**
```json
{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "9876543210",
  "dateOfBirth": "1990-01-01",
  "gender": null,
  "address": null,
  "city": null,
  "state": null,
  "pincode": null,
  ...
}
```

### POST `/api/signup/personal-details`
**Purpose:** Save form data
**Used in:** Onboarding.tsx handleSubmit

**Payload:**
```json
{
  "candidateId": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  ...
}
```

## Browser DevTools Testing

### Check localStorage
```javascript
// In browser console
localStorage.getItem('candidateId')
localStorage.getItem('registrationMethod')
localStorage.getItem('firstName')
localStorage.getItem('lastName')
localStorage.getItem('dateOfBirth')
```

### Clear localStorage
```javascript
// Reset to start over
localStorage.removeItem('candidateId')
localStorage.removeItem('registrationMethod')
localStorage.removeItem('registrationContact')
localStorage.removeItem('firstName')
localStorage.removeItem('lastName')
localStorage.removeItem('dateOfBirth')
```

### Check API Response
```javascript
// In browser Network tab
GET /api/candidates/123
// Look at response to verify fields are returned
```

## Error Scenarios

### Error: "Candidate ID not found"
**Cause:** User navigated to /onboard without completing signup
**Solution:** Redirect to signup page if candidateId is missing
```javascript
if (!candidateId) {
  navigate('/individualsignup')
}
```

### Error: Form validation fails
**Cause:** Mandatory field is empty
**Solution:** Check validation errors and fill required fields
```javascript
if (!formData.phone) {
  errors.phone = 'Phone is required'
}
```

### Error: API call fails
**Cause:** Backend endpoint not available
**Solution:** Show error message and allow user to retry
```javascript
catch (err) {
  setError('Failed to fetch candidate data')
}
```

## Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

**Requirements:**
- ES6+ JavaScript support
- localStorage API
- React 16.8+ (for hooks)

## Performance Considerations

1. **Data Fetching** - Single API call on component mount
2. **Re-renders** - Only when form data changes
3. **Validation** - Client-side (no API calls)
4. **Storage** - localStorage reads only on app startup

## Security Considerations

1. **Sensitive Data** - DOB and name in localStorage (client-side only)
2. **API Calls** - Should use HTTPS in production
3. **Input Validation** - Server-side validation required
4. **Email/Phone** - Already verified via OTP before storage

## Future Enhancements

1. Add ability to change name/DOB with re-verification
2. Add automatic suggestion for missing email/phone
3. Add real-time field validation
4. Add progress indicator for form completion
5. Add auto-save functionality
6. Add undo/redo functionality
7. Add integration with address lookup API

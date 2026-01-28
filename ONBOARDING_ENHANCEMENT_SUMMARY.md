# Onboarding Form Enhancement - Implementation Summary

## Overview
The onboarding page now automatically populates and makes certain fields read-only based on the user's signup method and stored profile data. Mandatory fields are marked with an asterisk (*).

## Changes Made

### 1. Created AuthContext (`src/context/AuthContext.tsx`)
- New context to manage and persist signup data across pages
- Stores: `candidateId`, `registrationMethod`, `registrationContact`, `firstName`, `lastName`, `dateOfBirth`
- Data persists in localStorage for session persistence
- Methods:
  - `setCandidateData()` - Update any candidate data fields
  - `clearCandidateData()` - Clear all candidate data

### 2. Updated App.tsx
- Wrapped application with `AuthProvider`
- Ensures auth context is available throughout the app

### 3. Updated OTPVerification.tsx
- Added `useAuth` hook to capture registration method
- When OTP is verified, saves `registrationMethod` (email/phone) and `registrationContact`
- This data is used by onboarding form to determine which fields are read-only

### 4. Updated IndividualSignup.tsx (signup page)
- Imported `useAuth` hook
- When OTP is verified, stores `candidateId` in context (in addition to localStorage)
- When user completes signup with name and DOB, CompleteSignup stores `firstName`, `lastName`, `dateOfBirth` in context

### 5. Updated CompleteSignup.tsx
- Imported `useAuth` hook
- Parses full name into `firstName` and `lastName`
- Stores name and DOB in auth context when form is submitted

### 6. Updated Onboarding.tsx (main page)
- Added `useAuth` hook to access signup data
- Added `useEffect` hook that:
  - Runs on component mount
  - Fetches candidate data from `/api/candidates/{candidateId}`
  - Pre-populates `firstName`, `lastName`, `dateOfBirth` from context/API
  - Pre-fills `email` or `phone` based on registration method
- Added loading state while fetching data
- Passes read-only flags to PersonalDetailsForm:
  - `isFirstNameReadOnly`: true if name was pre-populated
  - `isLastNameReadOnly`: true if name was pre-populated  
  - `isDateOfBirthReadOnly`: true if DOB was pre-populated
  - `isPhoneReadOnly`: true if registered via phone
  - `isEmailReadOnly`: true if registered via email

### 7. Updated PersonalDetailsForm.tsx
- Added `MANDATORY_FIELDS` constant listing required fields
- Added `renderLabel()` function to append * to mandatory field labels
- Displays hint text "* indicates mandatory field" at top of form
- For each field:
  - Mandatory fields show `label *`
  - Email/Phone fields show helper text "Read-only from signup" when disabled
  - DOB field shows helper text "Read-only from profile" when disabled
- Fields are disabled and set as read-only when:
  - `firstName`: disabled if `isFirstNameReadOnly` is true
  - `lastName`: disabled if `isLastNameReadOnly` is true
  - `dateOfBirth`: disabled if `isDateOfBirthReadOnly` is true
  - `phone`: disabled if `isPhoneReadOnly` is true (user registered with phone)
  - `email`: disabled if `isEmailReadOnly` is true (user registered with email)
- Optional fields (Aadhar, PAN, Bank Account) remain editable

## User Flow

1. **User Signs Up**
   - User enters email or phone number
   - System sends OTP and saves registration method in context
   - User verifies OTP and system saves `candidateId` in context
   - User enters full name and DOB (saved in context)
   - Redirected to onboarding page

2. **User Opens Onboarding Page**
   - Component checks context for `candidateId`
   - If found, fetches full candidate profile from backend
   - Populates form with:
     - `firstName` (read-only)
     - `lastName` (read-only)
     - `dateOfBirth` (read-only)
     - `email` or `phone` based on registration method (read-only)
   - User can edit other fields
   - All mandatory fields marked with *

3. **User Completes Onboarding**
   - Mandatory fields must be filled
   - Read-only fields cannot be edited
   - Optional fields are editable if needed
   - Form can be submitted and forwarded to education, skills, and review steps

## Mandatory Fields
- First Name *
- Last Name *
- Email *
- Phone *
- Date of Birth *
- Gender *
- Address *
- City *
- State *
- Pincode *

## Optional Fields
- Aadhar Number
- PAN Number
- Bank Account

## Testing Checklist
- [ ] User can complete signup with email
- [ ] User can complete signup with phone
- [ ] Onboarding page loads with pre-filled data
- [ ] First Name, Last Name, DOB are read-only
- [ ] Email or Phone is read-only based on signup method
- [ ] Can fill remaining mandatory fields
- [ ] Can submit and proceed to next steps
- [ ] Data persists if user navigates back

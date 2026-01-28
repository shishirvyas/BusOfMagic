-- Drop the old constraint with lowercase values
ALTER TABLE otp_verification DROP CONSTRAINT IF EXISTS otpv_check_contact_type;

-- Add new constraint with uppercase values (EMAIL, PHONE)
ALTER TABLE otp_verification ADD CONSTRAINT otpv_check_contact_type 
  CHECK (contact_type IN ('EMAIL', 'PHONE'));

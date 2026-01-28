interface OTPVerificationProps {
    contactType: 'email' | 'mobile';
    contact: string;
    onVerify: (otp: string) => void;
    onEdit: () => void;
    isLoading?: boolean;
}
export default function OTPVerification({ contactType, contact, onVerify, onEdit, isLoading, }: OTPVerificationProps): import("react/jsx-runtime").JSX.Element;
export {};

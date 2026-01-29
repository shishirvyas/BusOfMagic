interface CompleteSignupProps {
    contact: string;
    contactType: 'email' | 'mobile';
    onSubmit: (userData: {
        fullName: string;
        dateOfBirth: string;
        contact: string;
        contactType: string;
    }) => void;
    isLoading?: boolean;
}
export default function CompleteSignup({ contact, contactType, onSubmit, isLoading, }: CompleteSignupProps): import("react/jsx-runtime").JSX.Element;
export {};

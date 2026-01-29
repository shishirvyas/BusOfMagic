interface SignupFormProps {
    onSubmit: (contact: string, contactType: 'email' | 'mobile') => void;
    isLoading?: boolean;
}
export default function SignupForm({ onSubmit, isLoading }: SignupFormProps): import("react/jsx-runtime").JSX.Element;
export {};

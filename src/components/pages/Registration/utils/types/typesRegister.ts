export interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    organization_name: string;
    agreeTerms: boolean;
}

export interface FormErrors {
    first_name?: string;
    last_name?: string;
    email?: string;
    organization_name?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
}
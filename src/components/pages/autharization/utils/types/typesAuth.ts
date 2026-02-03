export interface FormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface FormErrors {
    email?: string;
    password?: string;
}
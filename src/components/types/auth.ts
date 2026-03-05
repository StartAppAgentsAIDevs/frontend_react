import { Organization } from "./organization";

export interface RegisterRequest {
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    phone?: string;
    telegram_id?: string;
    password: string;
    organization_name?: string;
}

export interface UserResponse {
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    phone?: string | null;
    telegram_id?: string | null;
    id: string;
    is_blocked: boolean;
    is_staff: boolean;
    is_email_verified: boolean;
    registration_date: string;
    organizations: Organization[];
}

export interface ErrorResponse {
    detail: string;
}
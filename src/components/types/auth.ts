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

export interface Organization {
    id: string;
    name: string;
    slug: string;
    role: 'owner' | 'member' | 'admin';
    joined_at: string;
    is_active: boolean;
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
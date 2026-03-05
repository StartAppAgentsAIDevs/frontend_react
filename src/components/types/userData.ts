import { Organization } from "./organization";


export interface UserProfile {
    email: string;
    first_name: string | null;
    last_name: string | null;
    middle_name: string | null;
    phone: string | null;
    telegram_id: string | null;
    id: string;
    is_blocked: boolean;
    is_staff: boolean;
    is_email_verified: boolean;
    registration_date: string;
    organizations: Organization[];
}
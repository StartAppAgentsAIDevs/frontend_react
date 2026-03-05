export interface Organization {
    id: string;
    name: string;
    slug: string;
    role: 'owner' | 'admin' | 'member';
    joined_at: string;
    is_active: boolean;
}
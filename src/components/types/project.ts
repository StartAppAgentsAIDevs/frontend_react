export interface CreateProjectRequest {
    name: string;
    timezone: string;
    language: string;
    organization_id: string;
    platform_type: string;
}

export interface ProjectResponse {
    name: string;
    timezone: string;
    language: string;
    status: string;
    state: string;
    platform_type: string;
    id: string;
    organization_id: string;
    application_id: string | null;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    application: any | null;
}

export interface ProjectFormData {
    name: string;
    timezone: string;
    language: string;
    organization_id: string;
    platform_type: string;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface ErrorResponse {
    detail: ValidationError[] | string;
}
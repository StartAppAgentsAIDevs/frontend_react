export interface JwtPayload {
    exp: number;
    iat: number;
    sub?: string;
    email?: string;
    [key: string]: any;
}

export const decodeJWT = (token: string): JwtPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
};

export const getTokenExpiryTime = (token: string): number | null => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return null;
    return payload.exp * 1000;
};

export const getTimeUntilTokenExpiry = (token: string): number | null => {
    const expiryTime = getTokenExpiryTime(token);
    if (!expiryTime) return null;

    const currentTime = Date.now();
    return expiryTime - currentTime;
};
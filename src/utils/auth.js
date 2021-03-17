import jwt_decode from 'jwt-decode';


export const isTokenValid = (rawToken) => {
    const token = getDecodedAccessToken(rawToken);
    
    if (token) {
        if (new Date(token.exp).getTime() * 1000 <= new Date().getTime()) {
            return false;
        }
        return true;
    }
    return false;

}

const getDecodedAccessToken = (rawToken) => {

    if (!rawToken) {
        return null;
    }
    try {
        return jwt_decode(rawToken);
    } catch (Error) {
        return null;
    }
}


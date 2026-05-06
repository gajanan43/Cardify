

const BASE_URL = `${process.env.REACT_APP_API_URL}/api/auth`;

export const normalizeToken = (value) => {
    if (!value) return "";

    const raw = String(value).trim();
    const withoutBearer = raw.replace(/^Bearer\s+/i, "");
    return withoutBearer.replace(/^"(.*)"$/, "$1");
};

export const loginUser = async (data) => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Login failed");

    const responseText = await res.text();
    const token = normalizeToken(responseText);

    if (!token) {
        throw new Error("Login succeeded but no token was returned");
    }

    localStorage.setItem("token", token);

    return token;
};

export const signupUser = async (data) => {
    const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Signup failed");

    return await res.json();
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const getToken = () => normalizeToken(localStorage.getItem("token"));


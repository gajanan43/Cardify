import { getToken, normalizeToken } from '../auth/authService';

const BASE_URL = "http://localhost:8080/api/card";

const authHeaders = () => {
    const token = normalizeToken(getToken());

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

const readErrorMessage = async (res) => {
    try {
        const text = await res.text();
        return text || res.statusText || 'Request failed';
    } catch (err) {
        return res.statusText || 'Request failed';
    }
};

// 🔹 GET
export const getCards = async () => {
    const token = normalizeToken(getToken());
    if (!token) {
        throw new Error('No access token found. Please log in again.');
    }

    const res = await fetch(BASE_URL, {
        headers: authHeaders(),
    });

    if (!res.ok) {
        const message = await readErrorMessage(res);
        const error = new Error(`Failed to fetch cards (${res.status}): ${message}`);
        error.status = res.status;
        throw error;
    }

    return await res.json();
};

// 🔹 CREATE
export const createCard = async (formData) => {
    const token = normalizeToken(getToken());
    if (!token) {
        throw new Error('No access token found. Please log in again.');
    }

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
    });

    if (!res.ok) {
        const message = await readErrorMessage(res);
        const error = new Error(`Failed to create card (${res.status}): ${message}`);
        error.status = res.status;
        throw error;
    }

    return await res.json();
};

// 🔹 DELETE
export const deleteCard = async (id) => {
    const token = normalizeToken(getToken());
    if (!token) {
        throw new Error('No access token found. Please log in again.');
    }

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!res.ok) {
        const message = await readErrorMessage(res);
        const error = new Error(`Failed to delete card (${res.status}): ${message}`);
        error.status = res.status;
        throw error;
    }
};

// 🔹 UPDATE
export const updateCard = async (id, formData) => {
    const token = normalizeToken(getToken());
    if (!token) {
        throw new Error('No access token found. Please log in again.');
    }

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: formData,
    });

    if (!res.ok) {
        const message = await readErrorMessage(res);
        const error = new Error(`Failed to update card (${res.status}): ${message}`);
        error.status = res.status;
        throw error;
    }

    return await res.json();
};
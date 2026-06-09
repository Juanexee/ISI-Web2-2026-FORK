import TokenResponse from '../models/response/token.response.js';

export default class HttpService {
    baseUrl = 'https://localhost:7286/api';
    // get
    async get(endpoint) {
        const fullEndpoint = this.baseUrl + endpoint;
        const token = TokenResponse.loadFromLocalStorage();

        const headers = { 'Content-Type': 'application/json' };
        if (token !== null && token.isValid()) {
            headers['Authorization'] = `Bearer ${token.token}`;
        }

        const response = await fetch(fullEndpoint, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred while fetching data.');
        }

        return await response.json();
    }
    // post
    async post(endpoint, body) {
        const token = TokenResponse.loadFromLocalStorage();

        const headers = { 'Content-Type': 'application/json' };
        if (token !== null && token.isValid()) {
            headers['Authorization'] = `Bearer ${token.token}`;
        }

        const fullEndpoint = this.baseUrl + endpoint;
        const response = await fetch(fullEndpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred while posting data.');
        }

        return await response.json();
    }
    // put
    async put(endpoint, body) {
        const token = TokenResponse.loadFromLocalStorage();

        const headers = { 'Content-Type': 'application/json' };
        if (token !== null && token.isValid()) {
            headers['Authorization'] = `Bearer ${token.token}`;
        }

        const fullEndpoint = this.baseUrl + endpoint;
        const response = await fetch(fullEndpoint, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred while putting data.');
        }

        return await response.json();
    }
    // delete
    async delete(endpoint) {
        const token = TokenResponse.loadFromLocalStorage();

        const headers = { 'Content-Type': 'application/json' };
        if (token !== null && token.isValid()) {
            headers['Authorization'] = `Bearer ${token.token}`;
        }

        const fullEndpoint = this.baseUrl + endpoint;
        const response = await fetch(fullEndpoint, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred while deleting data.');
        }

        return await response.json();
    }
}
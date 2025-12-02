const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Occurrence endpoints
    async getOccurrences(filters = {}) {
        const queryParams = new URLSearchParams();
        
        if (filters.type && filters.type !== 'all') {
            queryParams.append('type', filters.type);
        }
        if (filters.status) {
            queryParams.append('status', filters.status);
        }

        return this.request(`/occurrences?${queryParams}`);
    }

    async getOccurrence(id) {
        return this.request(`/occurrences/${id}`);
    }

    async createOccurrence(occurrenceData) {
        return this.request('/occurrences', {
            method: 'POST',
            body: JSON.stringify(occurrenceData),
        });
    }

    async confirmOccurrence(id) {
        return this.request(`/occurrences/${id}/confirm`, {
            method: 'PUT',
        });
    }

    async updateOccurrence(id, updateData) {
        return this.request(`/occurrences/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    // Stats endpoints
    async getStats() {
        return this.request('/stats');
    }

    // User endpoints
    async getLeaderboard() {
        return this.request('/users/leaderboard');
    }
}

export const apiService = new ApiService();
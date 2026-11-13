import { ref } from 'vue';
import { defineStore } from 'pinia';
import authService from '@/services/auth.service.js';

export const useAuthStore = defineStore('auth', () => {

    const currentUser = ref(null);
    const isAuthenticated = ref(false);

    const login = async (credentials) => {
        const response = await authService.login(credentials);

        if (response.error) {
            return response;
        }

        setCurrentUserState(response.data);
        isAuthenticated.value = true;

        return response;
    };

    const logout = async () => {
        await authService.logout();

        currentUser.value = null;
        isAuthenticated.value = false;
    };

    const setCurrentUserState = (user) => {
        currentUser.value = user;
    };

    const checkAuth = async () => {
        try {
            const response = await authService.getCurrentUser();

            if (response.error) {
                currentUser.value = null;
                isAuthenticated.value = false;
                return false;
            }

            currentUser.value = response.data;
            isAuthenticated.value = true;
            return true;

        } catch (err) {
            currentUser.value = null;
            isAuthenticated.value = false;
            return false;
        }
    };

    return {
        currentUser,
        isAuthenticated,
        login,
        logout,
        checkAuth,
    };
});
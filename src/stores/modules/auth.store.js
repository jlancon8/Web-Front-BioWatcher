import { ref } from 'vue';
import { defineStore } from 'pinia';
import authService from '@/services/auth.service.js';
import {useNotificationStore} from "@/stores/modules/notifs.store.js";
import {useUsersStore} from "@/stores/modules/users.store.js";

export const useAuthStore = defineStore('auth', () => {

    const notificationsStore = useNotificationStore()
    const userStore = useUsersStore()

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

    // the source of truth is the auth store where we print the current user,
    // so the profile update lives here and the component never has to resync anything
    const updateProfile = async (data) => {
        const updated = await userStore.updateUser(currentUser.value.id, data);
        if (updated) {
            currentUser.value = {...currentUser.value, ...updated};
        }
        return updated;
    };

    // two different methods because they do not have the same rights, one is for the admin, that can
    // update other accounts, and one is to update self
    const updateSelfProfile = async (data) => {
        const updated = await userStore.updateMe(currentUser.value.id, data);
        if (updated) {
            currentUser.value = {...currentUser.value, ...updated};
        }
        return updated;
    };

    return {
        currentUser,
        isAuthenticated,
        login,
        logout,
        checkAuth,
        updateProfile,
        updateSelfProfile
    };
});
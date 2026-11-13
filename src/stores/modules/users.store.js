import {ref} from 'vue'
import {defineStore} from 'pinia'
import usersService from "@/services/users.service.js"
import {useNotificationStore} from "@/stores/modules/notifs.store.js";

export const useUsersStore = defineStore('users', () => {
    // state
    const users = ref([])
    const notificationsStore = useNotificationStore()

    const setUsersState = (accounts) => {
        users.value = accounts
    }

    const updateUserState = (updatedUser) => {
        const index = users.value.findIndex(user => String(user._id) === String(updatedUser._id));
        if (index !== -1) {
            users.value[index] = updatedUser;
        }
    }

    const createUserState = (newUser) => {
        users.value.push(newUser);
    }

    const deleteUserState = (idUser) => {
        users.value = users.value.filter(user => String(user._id) !== String(idUser));
    }

    const getUsers = async () => {
        try {
            const response = await usersService.getUsers();
            setUsersState(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const updateUser = async (idUser, data) => {
        try {
            const response = await usersService.updateUser(idUser, data);
            updateUserState(response.data)
            notificationsStore.notify('Utilisateur mis à jour')
            return response.data
        } catch (e) {
            console.error(e)
            notificationsStore.notify('Échec de la mise à jour de l\'utilisateur', 'error')
            return null
        }
    }

    const updateMe = async (idUser, data) => {
        try {
            const response = await usersService.updateMe(idUser, data);
            updateUserState(response.data)
            notificationsStore.notify('Utilisateur mis à jour')
            return response.data
        } catch (e) {
            console.error(e)
            notificationsStore.notify('Échec de la mise à jour de l\'utilisateur', 'error')
            return null
        }
    }

    const createUser = async (data) => {
        try {
            const response = await usersService.createUser(data);
            notificationsStore.notify('Utilisateur crée avec succès')
            createUserState(response.data)
        } catch (e) {
            console.error(e)
            notificationsStore.notify('Échec de la mise à jour de l\'utilisateur', 'error')
        }
    }

    const deleteUser = async (idUser) => {
        try {
            const response = await usersService.deleteUser(idUser);
            deleteUserState(response.data._id)
        } catch (e) {
            console.error(e)
        }
    }

    const getUserById = (id) => {
        return users.value.find(user => String(user._id) === String(id));
    }

    return {
        getUsers,
        users,
        getUserById,
        updateMe,
        updateUser,
        createUser,
        deleteUser
    }
})
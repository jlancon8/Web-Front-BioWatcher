import {ref} from 'vue'
import {defineStore} from 'pinia'
import modulesService from "@/services/modules.service.js"
import {useNotificationStore} from "@/stores/modules/notifs.store.js";

export const useModulesStore = defineStore('modules', () => {
    // state
    const modules = ref([])
    const notificationsStore = useNotificationStore()

    const setModulesState = (newModules) => {
        modules.value = newModules
    }

    const deleteModuleState = (idModule) => {
        modules.value = modules.value.filter(module => String(module._id) !== String(idModule));
    }

    const updateModuleState = (updatedModule) => {
        const index = modules.value.findIndex(module => String(module._id) === String(updatedModule._id));
        if (index !== -1) {
            modules.value[index] = updatedModule;
        }
    }

    const getModules = async () => {
        try {
            const response = await modulesService.getModules();
            setModulesState(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const deleteModule = async (idModule) => {
        try {
            const response = await modulesService.deleteModule(idModule);
            deleteModuleState(response.data._id)
            notificationsStore.notify('Suppression effectué avec succès')
        } catch (e) {
            console.error(e)
            notificationsStore.notify('Échec de la suppression du module', 'error')
        }
    }

    const updateModule = async (idModule, data) => {
        try {
            const response = await modulesService.updateModule(idModule, data);
            updateModuleState(response.data)
            notificationsStore.notify('Modification du module effectué avec succès')
        } catch (e) {
            console.error(e)
            notificationsStore.notify('Échec de la suppression du module', 'error')
        }
    }

    const getOnlineModules = () => {
        return modules.value.filter(module => module.status === 'online');
    }

    return {
        getModules,
        getOnlineModules,
        modules,
        deleteModule,
        updateModule
    }
})
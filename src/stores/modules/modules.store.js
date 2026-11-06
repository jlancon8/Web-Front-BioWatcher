import {ref} from 'vue'
import {defineStore} from 'pinia'
import modulesService from "@/services/modules.service.js"

export const useModulesStore = defineStore('modules', () => {
    // state
    const modules = ref([])

    const updateModules = (newModules) => {
        modules.value = newModules
    }

    const removeModule = (idModule) => {
        modules.value = modules.value.filter(module => String(module._id) !== String(idModule));
    }



    const getModules = async () => {
        try {
            const response = await modulesService.getModules();
            updateModules(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const deleteModule = async (idModule) => {
        try {
            const response = await modulesService.deleteModule(idModule);
            removeModule(response.data._id)
        } catch (e) {
            console.error(e)
        }
    }

    const getOnlineModules = () => {
        return modules.value.filter(module => module.status === 'online');
    }

    return {
        getModules,
        getOnlineModules,
        modules,
        deleteModule
    }
})
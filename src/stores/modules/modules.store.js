import {ref} from 'vue'
import {defineStore} from 'pinia'
import modulesService from "@/services/modules.service.js"

export const useModulesStore = defineStore('modules', () => {
    // state
    const modules = ref([])

    const updateModules = (newModules) => {
        modules.value = newModules
    }

    const getModules = async () => {
        try {
            const response = await modulesService.getModules();
            updateModules(response.data)
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
        modules
    }
})
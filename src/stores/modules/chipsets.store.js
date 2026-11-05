import {ref} from 'vue'
import {defineStore} from 'pinia'
import chipsetsServices from "@/services/chipsets.service.js"

export const useChipsetsStore = defineStore('chipsets', () => {
    // state
    const chipsets = ref([])

    const updateChipsets = (newChipsets) => {
        chipsets.value = newChipsets
    }

    const getChipsets = async () => {
        try {
            const response = await chipsetsServices.getChipsets();
            updateChipsets(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const getChipsetById = (id) => {
        return chipsets.value.find(chipset => String(chipset._id) === String(id));
    }

    return {
        getChipsets,
        chipsets,
        getChipsetById
    }
})
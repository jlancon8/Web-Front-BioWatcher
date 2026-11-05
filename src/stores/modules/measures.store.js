import {ref} from 'vue'
import {defineStore} from 'pinia'
import measuresService from "@/services/measures.service.js"

export const useMeasuresStore = defineStore('measures', () => {
    // state
    const measures = ref([])
    const latestMeasures = ref([])

    const updateMeasures = (newMeasures) => {
        measures.value = newMeasures
    }

    const updateLatestMeasures = (newMeasures) => {
        latestMeasures.value = newMeasures
    }

    const getMeasures = async () => {
        try {
            const response = await measuresService.getMeasures();
            updateMeasures(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const getMeasureById = (id) => {
        return measures.value.find(measure => String(measure._id) === String(id));
    }

    const getLatestMeasures = async () => {
        try {
            const response = await measuresService.getLatestMeasures();
            console.log("Latest measures fetched:", response.data);
            updateLatestMeasures(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    return {
        getMeasures,
        getLatestMeasures,
        getMeasureById,
        measures,
        latestMeasures
    }
})
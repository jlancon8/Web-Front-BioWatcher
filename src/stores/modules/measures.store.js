import {ref} from 'vue'
import {defineStore} from 'pinia'
import measuresService from "@/services/measures.service.js"

export const useMeasuresStore = defineStore('measures', () => {
    // state
    const measures = ref([])
    const latestMeasures = ref([])

    const setMeasuresState = (newMeasures) => {
        measures.value = newMeasures
    }

    const setLatestMeasuresState = (newMeasures) => {
        latestMeasures.value = newMeasures
    }

    const getMeasures = async () => {
        try {
            const response = await measuresService.getMeasures();
            setMeasuresState(response.data)
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
            setLatestMeasuresState(response.data)
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
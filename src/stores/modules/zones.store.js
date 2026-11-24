import {ref} from 'vue'
import {defineStore} from 'pinia'
import zonesService from "@/services/zones.service.js"
import {useNotificationStore} from "@/stores/modules/notifs.store.js";

export const useZonesStore = defineStore('zones', () => {

    const notificationsStore = useNotificationStore()

    // state
    const zones = ref([])
    const myZones = ref([])

    const setZonesState = (newZones) => {
        zones.value = newZones;
    }

    const setMyZonesState = (myNewZones) => {
        myZones.value = myNewZones;
    }

    const addZoneState = (newZone) => {
        zones.value.push(newZone);
    }

    const addMyZoneState = (myZone) => {
        myZones.value.push(myZone);
    }

    const getZones = async () => {
        try {
            const response = await zonesService.getZones();
            setZonesState(response.data)
            return response.data
        } catch (e) {
            console.error(e)
        }
    }

    const getMyZones = async () => {
        try {
            const response = await zonesService.getMyZones();
            setMyZonesState(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    const createZone = async (data) => {
        try {
            const response = await zonesService.createZone(data);
            addMyZoneState(response.data)
            addZoneState(response.data)
            notificationsStore.notify('Zone créée avec succès')
        } catch (e) {
            console.error(e)
            notificationsStore.notify('Échec de la mise à jour de l\'utilisateur', 'error')
        }
    }

    return {
        getZones,
        zones,
        myZones,
        getMyZones,
        createZone
    }
})
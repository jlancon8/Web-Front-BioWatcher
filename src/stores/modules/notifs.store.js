import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useNotificationStore = defineStore('notifs', () => {
    const notifications = ref([])
    let nextId = 0 // without an id, we couldnt retire the right notification if there is two
    // at the same time

    const remove = (id) => {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }

    const notify = (message, color = 'success', duration = 3000) => {
        const id = nextId++
        notifications.value.push({id, message, color})
        if (duration > 0) setTimeout(() => remove(id), duration)
        return id
    }

    return {
        notifications,
        notify,
        remove
    }
})
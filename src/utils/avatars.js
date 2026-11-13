const modules = import.meta.glob('../assets/avatars/*.webp', {eager: true, import: 'default'})

const noAvatar = {
    id: "no_avatar",
    label: "no_avatar",
    src: "/src/assets/avatars/no_avatar.webp"
}
export const avatars = Object.entries(modules)
    .filter(([path]) => /^avatar_\d+\.webp$/.test(path.split('/').pop())) // only take the following format :
    // avatar_idavatar.webp
    .map(([path, src]) => {
        const id = path.split('/').pop().replace('.webp', '')
        return {id, src, label: id.replace('-', ' ')}
    })
    .sort((a, b) => a.id.localeCompare(b.id, undefined, {numeric: true}))

export const getAvatar = (id) =>
    avatars.find(avatar => avatar.id === id) ?? noAvatar
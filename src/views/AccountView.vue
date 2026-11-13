<template>
  <div class="min-h-screen bg-[#f2f4ee] text-[#17352b]">

    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <h1 class="text-3xl font-extrabold">Mon compte</h1>
      <p class="mt-1.5 text-[15px] text-[#4f5f56]">Gérez vos informations personnelles et votre mot de passe.</p>

      <div class="mt-6 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div class="flex flex-col gap-6">
          <form class="flex flex-col gap-4 rounded-2xl border border-[#dde3d8] bg-white p-6"
                @submit.prevent="submitProfile">
            <h2 class="text-lg font-extrabold">Informations personnelles</h2>

            <div class="flex flex-col gap-1.5">
              <label for="nom" class="text-[13px] text-[#4f5f56]">Login</label>
              <input
                  id="nom"
                  v-model="accountForm.name"
                  type="text"
                  required
                  class="w-full rounded-lg border border-[#c3cdc4] bg-white px-3.5 py-3 text-[15px] text-[#17352b] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="nom" class="text-[13px] text-[#4f5f56]">Login</label>
              <input
                  id="nom"
                  v-model="accountForm.login"
                  type="text"
                  required
                  class="w-full rounded-lg border border-[#c3cdc4] bg-white px-3.5 py-3 text-[15px] text-[#17352b] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-[13px] text-[#4f5f56]">Adresse e-mail</label>
              <input
                  id="email"
                  v-model="accountForm.email"
                  type="email"
                  required
                  class="w-full rounded-lg border border-[#c3cdc4] bg-white px-3.5 py-3 text-[15px] text-[#17352b] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="role" class="text-[13px] text-[#4f5f56]">Rôle</label>
              <input
                  id="role"
                  :value="formatRole(authStore.currentUser.rights)"
                  type="text"
                  disabled
                  class="w-full rounded-lg border border-[#dde3d8] bg-[#f2f4ee] px-3.5 py-3 text-[15px] text-[#4f5f56]"
              />
              <span class="text-[13px] text-[#4f5f56]">Le rôle est défini par un administrateur.</span>
            </div>

            <div>
              <button
                  type="submit"
                  :disabled="!isDirty"
                  class="min-h-11 rounded-lg bg-[#17352b] px-6 text-[15px] font-bold text-white hover:bg-[#1d4638] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </form>

          <form class="flex flex-col gap-4 rounded-2xl border border-[#dde3d8] bg-white p-6"
                @submit.prevent="submitPassword">
            <h2 class="text-lg font-extrabold">Mot de passe</h2>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label for="nouveau" class="text-[13px] text-[#4f5f56]">Nouveau mot de passe</label>
                <input
                    id="nouveau"
                    v-model="passwords.newPassword"
                    type="password"
                    autocomplete="new-password"
                    required
                    class="w-full rounded-lg border border-[#c3cdc4] bg-white px-3.5 py-3 text-[15px] text-[#17352b] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="confirmation" class="text-[13px] text-[#4f5f56]">Confirmation</label>
                <input
                    id="confirmation"
                    v-model="passwords.confirmationPassword"
                    type="password"
                    autocomplete="new-password"
                    required
                    class="w-full rounded-lg border border-[#c3cdc4] bg-white px-3.5 py-3 text-[15px] text-[#17352b] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
                />
              </div>
            </div>

            <p v-if="passwordError" class="text-sm text-[#9a1b0e]" role="alert">{{ passwordError }}</p>

            <div>
              <button
                  type="submit"
                  class="cursor-pointer min-h-11 rounded-lg border border-[#c3cdc4] bg-white px-6 text-[15px] font-bold hover:bg-[#f2f4ee]"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>

        <aside class="flex flex-col gap-6">
          <section class="flex flex-col gap-3.5 rounded-2xl border border-[#dde3d8] bg-white p-6">
            <div class="flex items-center gap-3.5">
              <button
                  type="button"
                  class="relative h-[64px] w-[64px] shrink-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f]"
                  aria-label="Changer de photo de profil"
                  @click="openAvatarDialog"
              >
                <img
                    :src="getAvatar(authStore.currentUser.avatar).src"
                    :alt="getAvatar(authStore.currentUser.avatar).label"
                    class="h-full w-full rounded-full bg-[#d8eadd] object-cover"
                />
                <span
                    class="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#17352b] text-white">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  </svg>
                </span>
              </button>
              <div class="min-w-0">
                <div class="truncate text-[17px] font-extrabold">{{ authStore.currentUser.name }}</div>
                <div class="truncate text-[13px] text-[#4f5f56]"> {{ authStore.currentUser.email }}</div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="rounded-full bg-[#e0e8f7] px-3 py-1 text-[13px] font-bold"
                    :class="`account-badge account-badge--${authStore.currentUser.rights}`"> {{
                  formatRole(authStore.currentUser.rights)
                }}</span>
            </div>
          </section>

          <button
              type="button"
              class="min-h-11 rounded-lg border border-[#e3b4ae] bg-white px-6 text-[15px] font-bold text-[#9a1b0e] hover:bg-[#fbeceb]"
              @click="handleLogout"
          >
            Se déconnecter
          </button>
        </aside>
      </div>
      <ConfirmUpdateDialog
          v-model="isSaving"
          title="Enregistrer les modifications"
          @confirm="saveAccount"
      >
        Les informations de {{ authStore.currentUser.name ?? authStore.currentUser.login }} seront mises à jour.
      </ConfirmUpdateDialog>

      <ConfirmUpdateDialog
          v-model="isSavingPassword"
          title="Modifier le mot de passe"
          @confirm="savePassword"
      >
        Votre mot de passe va être modifié.
      </ConfirmUpdateDialog>
    </main>

    <dialog
        ref="avatarDialog"
        class="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[#dde3d8] bg-white p-0 text-[#17352b] shadow-xl backdrop:bg-black/40"
        @click.self="closeAvatarDialog"
    >
      <div class="flex flex-col gap-4 p-6">
        <div>
          <h2 class="text-lg font-extrabold">Photo de profil</h2>
          <p class="mt-0.5 text-[13px] text-[#4f5f56]">Choisissez un avatar.</p>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <button
              v-for="avatar in avatars"
              :key="avatar.id"
              type="button"
              class="aspect-square cursor-pointer overflow-hidden rounded-full border-2 bg-[#d8eadd] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d6a4f]"
              :class="getAvatar(authStore.currentUser.avatar).id === avatar.id ? 'border-[#2d6a4f] ring-2 ring-[#2d6a4f]/30' : 'border-transparent hover:border-[#c3cdc4]'"
              :aria-pressed="getAvatar(authStore.currentUser.avatar).id === avatar.id"
              :aria-label="avatar.label"
              @click="chooseAvatar(avatar)"
          >
            <img :src="avatar.src" :alt="avatar.label" class="h-full w-full object-cover"/>
          </button>
        </div>

        <button
            type="button"
            class="min-h-11 cursor-pointer rounded-lg border border-[#c3cdc4] bg-white px-6 text-[15px] font-bold hover:bg-[#f2f4ee]"
            @click="closeAvatarDialog"
        >
          Fermer
        </button>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import {computed, reactive, ref} from 'vue'
import {useAuthStore} from "@/stores/modules/auth.store.js";
import {formatRole} from "../utils/formatter.js";
import ConfirmUpdateDialog from "@/components/common/ConfirmUpdateDialog.vue";
import {useUsersStore} from "@/stores/modules/users.store.js";
import router from "@/router/index.js";
import {avatars, getAvatar} from "@/utils/avatars.js";

const authStore = useAuthStore();
const userStore = useUsersStore()
const passwords = ref({newPassword: '', confirmationPassword: ''})
const passwordError = ref('')
const isSaving = ref(false)
const isSavingPassword = ref(false)

const accountForm = ref({
  name: authStore.currentUser.name,
  login: authStore.currentUser.login,
  email: authStore.currentUser.email,
})

const isValid = computed(() => {
  const validLogin = accountForm.value.login.trim() !== '' && !/\s/.test(accountForm.value.login)
  const validEmail = /^\S+@\S+\.\S+$/.test(accountForm.value.email)

  return validLogin && validEmail
})

const isDirty = computed(() =>
        isValid.value && (
            accountForm.value.login !== authStore.currentUser.login ||
            accountForm.value.email !== authStore.currentUser.email ||
            accountForm.value.name !== authStore.currentUser.name
        )
)

const avatarDialog = ref(null)

function submitProfile() {
  if (!isDirty.value) return
  isSaving.value = true
}

async function saveAccount() {
  const {name, login, email} = accountForm.value
  try {
    await authStore.updateSelfProfile({name, login, email})
    isSaving.value = false
  } catch (e) {
    console.error(e)
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function openAvatarDialog() {
  avatarDialog.value?.showModal()
}

function closeAvatarDialog() {
  avatarDialog.value?.close()
}

async function chooseAvatar(avatar) {
  const updated = await authStore.updateSelfProfile({
    avatar: avatar.id
  });

  if (updated) {
    closeAvatarDialog();
  }
}

function submitPassword() {
  passwordError.value = ''
  if (passwords.value.newPassword.length < 8) {
    passwordError.value = 'Le nouveau mot de passe doit faire au moins 8 caractères.'
    return
  }
  if (passwords.value.newPassword !== passwords.value.confirmationPassword) {
    passwordError.value = 'La confirmation ne correspond pas.'
    return
  }
  isSavingPassword.value = true
}

async function savePassword() {
  try {
    await authStore.updateSelfProfile({password: passwords.value.newPassword})
    passwords.value = {newPassword: '', confirmationPassword: ''}
  } catch (e) {
    console.error(e)
    passwordError.value = 'Impossible de modifier le mot de passe.'
  } finally {
    isSavingPassword.value = false
  }
}
</script>
<template>
  <main class="min-w-0 flex-1 p-4 md:p-8">
    <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-[#1c382c] md:text-2xl">
          Gestion des comptes
        </h1>
      </div>

      <button
          type="button"
          class="min-h-11 cursor-pointer rounded-[10px] bg-[#14352a] px-4 text-sm font-bold text-white"
          @click="startCreation"
      >
        Créer un compte
      </button>
    </header>

    <div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
      <div class="overflow-x-auto rounded-2xl border border-[#dce4dd] bg-white px-5 pb-3 pt-2">
        <table class="w-full min-w-[560px] border-collapse text-sm">
          <thead>
          <tr class="text-left text-[13px] text-[#55655b]">
            <th class="px-2 py-3.5 font-medium">Utilisateur</th>
            <th class="px-2 py-3.5 font-medium">Rôle</th>
            <th class="px-2 py-3.5 font-medium">Dernière connexion</th>
            <th class="px-2 py-3.5 font-medium">Statut</th>
          </tr>
          </thead>

          <tbody>
          <tr
              v-for="account in userStore.users"
              :key="account._id"
              :class="[
                'cursor-pointer border-t border-[#e3e9e4]',
                selectedId === account._id
                  ? 'bg-[#eaf3ec]'
                  : 'hover:bg-[#f5f8f5]'
              ]"
              @click="selectAccount(account._id)"
          >
            <td class="px-2 py-3.5">
              <p class="font-extrabold text-[#1b2a22]">
                {{ account.login }}
              </p>
              <p class="text-xs text-[#55655b]">
                {{ account.email }}
              </p>
            </td>

            <td class="px-2 py-3.5">
              <span :class="`account-badge account-badge--${account.rights?.[0] ?? 'basic'}`">
                {{ formatRole(account.rights) }}
              </span>
            </td>

            <td class="px-2 py-3.5">
              {{ account.lastLogin ? formatDate(account.lastLogin) : 'Jamais' }}
            </td>

            <td class="px-2 py-3.5">
              <span :class="`account-badge account-badge--${account.active ? 'active' : 'inactive'}`">
                {{ account.active ? 'Actif' : 'Désactivé' }}
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-4">
        <aside
            v-if="creating || selectedAccount"
            class="flex flex-col gap-4 rounded-2xl border border-[#dce4dd] bg-white p-5 md:p-6"
        >
          <h2 class="truncate text-[17px] font-extrabold text-[#1b2a22]">
            {{ creating ? 'Nouveau compte' : selectedAccount.login }}
          </h2>

          <form
              class="flex flex-col gap-4"
              @submit.prevent="saveAccount"
          >
            <div class="flex flex-col gap-1.5">
              <label
                  for="account-login"
                  class="text-[13px] text-[#55655b]"
              >
                Identifiant
              </label>

              <input
                  id="account-login"
                  v-model="form.login"
                  type="text"
                  autocomplete="off"
                  class="account-input"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label
                  for="account-email"
                  class="text-[13px] text-[#55655b]"
              >
                Adresse e-mail
              </label>

              <input
                  id="account-email"
                  v-model="form.email"
                  type="email"
                  autocomplete="off"
                  class="account-input"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label
                  for="account-role"
                  class="text-[13px] text-[#55655b]"
              >
                Rôle
              </label>

              <select
                  id="account-role"
                  v-model="form.role"
                  class="account-input"
              >
                <option
                    v-for="role in ROLES"
                    :key="role.value"
                    :value="role.label"
                >
                  {{ role.label }}
                </option>
              </select>
            </div>

            <div
                v-if="creating"
                class="flex flex-col gap-1.5"
            >
              <label
                  for="account-password"
                  class="text-[13px] text-[#55655b]"
              >
                Mot de passe
              </label>

              <input
                  id="account-password"
                  v-model="form.password"
                  type="password"
                  autocomplete="new-password"
                  class="account-input"
              />

              <p class="text-xs text-[#55655b]">
                8 caractères minimum
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                  type="submit"
                  :disabled="!isDirty || !isValid || saving"
                  class="min-h-11 flex-1 cursor-pointer rounded-[10px] bg-[#14352a] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {{
                  saving
                      ? 'Enregistrement...'
                      : creating
                          ? 'Créer le compte'
                          : 'Enregistrer'
                }}
              </button>

              <button
                  type="button"
                  :disabled="saving || (!creating && !isDirty)"
                  class="min-h-11 cursor-pointer rounded-[10px] border border-[#c7d2c9] bg-white px-4 text-sm hover:bg-[#f5f8f5] disabled:cursor-not-allowed disabled:opacity-40"
                  @click="cancel"
              >
                Annuler
              </button>

              <button
                  v-if="!creating"
                  type="button"
                  class="min-h-11 w-full cursor-pointer rounded-lg border border-[#e5b0a6] bg-white px-3.5 text-[13px] font-bold text-[#8a1f10] hover:bg-[#fdf1ee]"
                  @click="showDeleteDialog = true"
              >
                Supprimer le compte
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>

    <ConfirmDeleteDialog
        v-model="showDeleteDialog"
        title="Supprimer le compte"
        :confirm-text="selectedAccount?.login ?? ''"
        :loading="deleting"
        @confirm="deleteAccount"
    >
      Cette action est irréversible. Le compte sera définitivement supprimé.
    </ConfirmDeleteDialog>
  </main>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog.vue'
import {useUsersStore} from '@/stores/modules/users.store.js'
import {formatDate, formatRole, ROLES} from '@/utils/formatter.js'

const userStore = useUsersStore()

onMounted(async () => {
  await userStore.getUsers()
})

const emptyForm = () => ({
  login: '',
  email: '',
  role: ROLES[0].label,
  password: ''
})

const selectedId = ref(null)
const creating = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showDeleteDialog = ref(false)
const form = ref(emptyForm())

const selectedAccount = computed(() =>
    userStore.users.find(account => account._id === selectedId.value) ?? null
)

const isDirty = computed(() => {
  if (creating.value) {
    return (
        form.value.login.trim() !== '' ||
        form.value.email !== '' ||
        form.value.password !== ''
    )
  }

  const account = selectedAccount.value

  return !!account && (
      form.value.login !== account.login ||
      form.value.email !== account.email ||
      form.value.role !== formatRole(account.rights)
  )
})

const deleteAccount = async () => {
  const account = selectedAccount.value

  if (!account) return

  deleting.value = true
  await userStore.deleteUser(account._id)
  deleting.value = false
  showDeleteDialog.value = false

  selectedId.value = null
  creating.value = false
  form.value = emptyForm()
}

// verify that the form is valid before saving
const isValid = computed(() => {
  const validLogin = form.value.login.trim() !== '' && !/\s/.test(form.value.login) // login should not contain spaces
  const validEmail = /^\S+@\S+\.\S+$/.test(form.value.email)

  if (creating.value) {
    return (
        validLogin &&
        validEmail &&
        form.value.password.length >= 8 &&
        !!ROLES.find(role => role.label === form.value.role) && form.value.role
    )
  }

  return (
      validLogin &&
      validEmail &&
      !!ROLES.find(role => role.label === form.value.role)
  )
})

const resetForm = () => {
  const account = selectedAccount.value

  form.value = account
      ? {
        login: account.login ?? '',
        email: account.email ?? '',
        role: formatRole(account.rights),
        password: ''
      }
      : emptyForm()

  saving.value = false
}

const selectAccount = (id) => {
  creating.value = false
  selectedId.value = id
  resetForm()
}

const startCreation = () => {
  selectedId.value = null
  creating.value = true
  resetForm()
}

const cancel = () => {
  if (creating.value) {
    creating.value = false
    selectedId.value = null
    form.value = emptyForm()
    return
  }

  resetForm()
}

// handle both creation and update of an account
const saveAccount = async () => {
  if (saving.value || !isValid.value) return

  const role = ROLES.find(r => r.label === form.value.role)?.value

  const data = {
    login: form.value.login.trim(),
    email: form.value.email.trim(),
    rights: [role]
  }

  saving.value = true

  if (creating.value) {
    data.password = form.value.password
    await userStore.createUser(data)
  } else {
    const account = selectedAccount.value

    if (!account) return

    await userStore.updateUser(account._id, data)
  }

  if (creating.value) {
    creating.value = false
    selectedId.value = null
    form.value = emptyForm()
  } else {
    resetForm()
  }
}
</script>
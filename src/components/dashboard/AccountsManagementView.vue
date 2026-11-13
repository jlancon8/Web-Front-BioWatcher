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
                {{ account.name ?? account.login }}
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
            {{ creating ? 'Nouveau compte' : (selectedAccount.name ?? selectedAccount.login) }}
          </h2>

          <p
              v-if="isAdminTarget"
              class="rounded-lg bg-[#f5f8f5] px-3.5 py-2.5 text-[13px] text-[#55655b]"
          >
            Le profil d'un administrateur ne peut pas être modifié ici.
          </p>

          <form
              class="flex flex-col gap-4"
              @submit.prevent="onSubmit"
          >
            <fieldset
                :disabled="isAdminTarget"
                class="m-0 flex min-w-0 flex-col gap-4 border-0 p-0"
            >
              <div class="flex flex-col gap-1.5">
                <label
                    for="account-name"
                    class="text-[13px] text-[#55655b]"
                >
                  Nom
                </label>

                <input
                    id="account-name"
                    v-model="form.name"
                    type="text"
                    autocomplete="off"
                    class="account-input"
                />
              </div>

              <div class="flex flex-col gap-1.5" v-if="creating">
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
                      v-for="role in assignableRoles"
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
                    class="min-h-11 w-full cursor-pointer rounded-lg border border-[#e5b0a6] bg-white px-3.5 text-[13px] font-bold text-[#8a1f10] hover:bg-[#fdf1ee] disabled:cursor-not-allowed disabled:opacity-50"
                    @click="showDeleteDialog = true"
                >
                  Supprimer le compte
                </button>
              </div>
            </fieldset>
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

    <ConfirmUpdateDialog
        v-model="showSaveDialog"
        title="Enregistrer les modifications"
        :loading="saving"
        @confirm="confirmSave"
    >
      Les informations de {{ selectedAccount?.name ?? selectedAccount?.login }} seront mises à jour.
    </ConfirmUpdateDialog>
  </main>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import ConfirmDeleteDialog from '@/components/common/ConfirmDeleteDialog.vue'
import ConfirmUpdateDialog from '@/components/common/ConfirmUpdateDialog.vue'
import {useUsersStore} from '@/stores/modules/users.store.js'
import {formatDate, formatRole, ROLES} from '@/utils/formatter.js'

const userStore = useUsersStore()

onMounted(async () => {
  await userStore.getUsers()
})

const emptyForm = () => ({
  name: '',
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
const showSaveDialog = ref(false)
const form = ref(emptyForm())

// admin accounts are created from the console, never from the ui
const assignableRoles = computed(() => ROLES.filter(role => role.value !== 'admin'))

const selectedAccount = computed(() =>
    userStore.users.find(account => account._id === selectedId.value) ?? null
)

const isAdminTarget = computed(() =>
    !creating.value && !!selectedAccount.value?.rights?.includes('admin')
)

const isDirty = computed(() => {
  if (creating.value) {
    return (
        form.value.login.trim() !== '' ||
        form.value.email !== '' ||
        form.value.password !== '' ||
        form.value.name !== ''
    )
  }

  const account = selectedAccount.value

  return !!account && (
      form.value.login !== account.login ||
      form.value.email !== account.email ||
      form.value.role !== formatRole(account.rights) ||
      form.value.name !== (account.name ?? '')
  )
})

// verify that the form is valid before saving
const isValid = computed(() => {
  const validLogin = form.value.login.trim() !== '' && !/\s/.test(form.value.login) // login should not contain spaces
  const validEmail = /^\S+@\S+\.\S+$/.test(form.value.email)
  const validRole = !!assignableRoles.value.find(role => role.label === form.value.role)

  if (creating.value) {
    return (
        form.value.name !== '' &&
        validLogin &&
        validEmail &&
        form.value.password.length >= 8 &&
        validRole
    )
  }

  return validLogin && validEmail && validRole
})

const resetForm = () => {
  const account = selectedAccount.value

  form.value = account
      ? {
        login: account.login ?? '',
        name: account.name ?? '',
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

const deleteAccount = async () => {
  const account = selectedAccount.value

  if (!account || isAdminTarget.value) return

  deleting.value = true
  await userStore.deleteUser(account._id)
  deleting.value = false
  showDeleteDialog.value = false

  selectedId.value = null
  creating.value = false
  form.value = emptyForm()
}

// handle both creation and update of an account
const saveAccount = async () => {
  if (saving.value || !isValid.value || isAdminTarget.value) return

  const role = assignableRoles.value.find(r => r.label === form.value.role)?.value

  const data = {
    name: form.value.name,
    login: form.value.login.trim(),
    email: form.value.email.trim(),
    rights: [role]
  }

  if (creating.value) {
    saving.value = true
    data.password = form.value.password
    await userStore.createUser(data)

    creating.value = false
    selectedId.value = null
    form.value = emptyForm()
    saving.value = false
    return
  }

  const account = selectedAccount.value

  if (!account) return

  saving.value = true
  await userStore.updateUser(account._id, data)
  resetForm()
}

const onSubmit = () => {
  if (creating.value) {
    saveAccount()
    return
  }

  if (isValid.value && isDirty.value && !isAdminTarget.value) {
    showSaveDialog.value = true
  }
}

const confirmSave = async () => {
  await saveAccount()
  showSaveDialog.value = false
}
</script>
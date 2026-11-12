<template>
  <div class="min-h-screen bg-[#f2f4ee] text-[#17352b]">

    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <h1 class="text-3xl font-extrabold">Mon compte</h1>
      <p class="mt-1.5 text-[15px] text-[#4f5f56]">Gérez vos informations personnelles et votre mot de passe.</p>

      <div class="mt-6 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div class="flex flex-col gap-6">
          <form class="flex flex-col gap-4 rounded-2xl border border-[#dde3d8] bg-white p-6" @submit.prevent="submitProfile">
            <h2 class="text-lg font-extrabold">Informations personnelles</h2>

            <div class="flex flex-col gap-1.5">
              <label for="nom" class="text-[13px] text-[#4f5f56]">Nom</label>
              <input
                  id="nom"
                  v-model="profile.name"
                  type="text"
                  required
                  class="w-full rounded-lg border border-[#c3cdc4] bg-white px-3.5 py-3 text-[15px] text-[#17352b] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-[13px] text-[#4f5f56]">Adresse e-mail</label>
              <input
                  id="email"
                  v-model="profile.email"
                  type="email"
                  required
                  class="w-full rounded-lg border border-[#c3cdc4] bg-white px-3.5 py-3 text-[15px] text-[#17352b] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="role" class="text-[13px] text-[#4f5f56]">Rôle</label>
              <input
                  id="role"
                  value="Gestionnaire"
                  type="text"
                  disabled
                  class="w-full rounded-lg border border-[#dde3d8] bg-[#f2f4ee] px-3.5 py-3 text-[15px] text-[#4f5f56]"
              />
              <span class="text-[13px] text-[#4f5f56]">Le rôle est défini par un administrateur.</span>
            </div>

            <div>
              <button
                  type="submit"
                  class="min-h-11 rounded-lg bg-[#17352b] px-6 text-[15px] font-bold text-white hover:bg-[#1d4638]"
              >
                Enregistrer
              </button>
            </div>
          </form>

          <form class="flex flex-col gap-4 rounded-2xl border border-[#dde3d8] bg-white p-6" @submit.prevent="submitPassword">
            <h2 class="text-lg font-extrabold">Mot de passe</h2>

            <div class="flex flex-col gap-1.5">
              <label for="current" class="text-[13px] text-[#4f5f56]">Mot de passe actuel</label>
              <input
                  id="current"
                  v-model="passwords.current"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="w-full rounded-lg border border-[#c3cdc4] bg-white px-3.5 py-3 text-[15px] text-[#17352b] outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
              />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label for="nouveau" class="text-[13px] text-[#4f5f56]">Nouveau mot de passe</label>
                <input
                    id="nouveau"
                    v-model="passwords.nouveau"
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
                    v-model="passwords.confirmation"
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
                  class="min-h-11 rounded-lg border border-[#c3cdc4] bg-white px-6 text-[15px] font-bold hover:bg-[#f2f4ee]"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>

        <aside class="flex flex-col gap-6">
          <section class="flex flex-col gap-3.5 rounded-2xl border border-[#dde3d8] bg-white p-6">
            <div class="flex items-center gap-3.5">
              <div class="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#d8eadd] text-lg font-extrabold text-[#1d5a3a]">
                JP
              </div>
              <div class="min-w-0">
                <div class="truncate text-[17px] font-extrabold">Julien Perrin</div>
                <div class="truncate text-[13px] text-[#4f5f56]">julien.perrin@exemple.fr</div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="rounded-full bg-[#e0e8f7] px-3 py-1 text-[13px] font-bold text-[#1f3d7a]">Gestionnaire</span>
              <span class="rounded-full bg-[#d8eadd] px-3 py-1 text-[13px] font-bold text-[#1d5a3a]">Actif</span>
            </div>
            <div class="border-t border-[#e4e8df] pt-3.5 text-sm text-[#4f5f56]">
              Dernière connexion : hier, 17:40
            </div>
          </section>

          <section class="flex flex-col gap-2.5 rounded-2xl border border-[#dde3d8] bg-white p-6">
            <h2 class="text-lg font-extrabold">Ce que je peux faire</h2>
            <p class="text-sm leading-relaxed text-[#33453b]">
              Consulter les modules, les mesures et l'historique, et régler les modules (intervalle d'envoi, noms).
            </p>
            <p class="text-sm leading-relaxed text-[#4f5f56]">
              La création et la désactivation des comptes sont réservées aux administrateurs.
            </p>
          </section>

          <button
              type="button"
              class="min-h-11 rounded-lg border border-[#e3b4ae] bg-white px-6 text-[15px] font-bold text-[#9a1b0e] hover:bg-[#fbeceb]"
          >
            Se déconnecter
          </button>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const profile = reactive({ name: 'Julien Perrin', email: 'julien.perrin@exemple.fr' })
const passwords = reactive({ current: '', nouveau: '', confirmation: '' })
const passwordError = ref('')

function submitProfile() {}

function submitPassword() {
  passwordError.value = ''
  if (passwords.nouveau.length < 8) {
    passwordError.value = 'Le nouveau mot de passe doit faire au moins 8 caractères.'
    return
  }
  if (passwords.nouveau !== passwords.confirmation) {
    passwordError.value = 'La confirmation ne correspond pas.'
  }
}
</script>
<template>
  <div class="grid min-h-screen grid-cols-1 bg-[#f3f5ef] lg:grid-cols-2">
    <section class="relative hidden flex-col overflow-hidden bg-[#14352a] p-10 text-white lg:flex">
      <div class="relative z-10 flex items-center gap-2.5 text-[22px] font-extrabold tracking-tight">
        <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
          <circle cx="15" cy="15" r="15" fill="#3e8e5a"/>
          <path d="M15 6 L21 16 H17 L22 23 H8 L13 16 H9 Z" fill="#fff"/>
        </svg>
        BioWatcher
      </div>

      <div class="relative z-10 mt-[72px] max-w-[460px]">
        <h2 class="mb-3.5 text-[40px] font-extrabold leading-[1.1] tracking-tight">
          Surveillance intelligente des forêts
        </h2>
        <p class="text-[17px] leading-normal text-[#d5e8dc]">
          Suivez vos modules, leurs mesures et leur historique depuis un seul endroit.
        </p>
      </div>

      <svg
          viewBox="0 0 700 260"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
          class="absolute inset-x-0 bottom-0 block h-[260px] w-full"
      >
        <path d="M0,160 C120,100 260,180 400,130 S600,90 700,150 L700,260 L0,260 Z" fill="#1c4d3a"/>
        <g fill="#15412f">
          <polygon points="80,110 50,180 66,180 40,260 120,260 94,180 110,180"/>
          <polygon points="250,130 228,172 238,172 222,260 278,260 262,172 272,172"/>
          <polygon points="470,100 440,170 456,170 430,260 510,260 484,170 500,170"/>
          <polygon points="640,120 616,176 628,176 606,260 674,260 652,176 664,176"/>
        </g>
        <path d="M0,205 C150,170 300,225 450,195 S640,175 700,205 L700,260 L0,260 Z" fill="#2a6b50"/>
        <g fill="#235c44">
          <polygon points="170,175 150,208 160,208 144,260 196,260 180,208 190,208"/>
          <polygon points="360,182 340,212 350,212 334,260 386,260 370,212 380,212"/>
          <polygon points="560,176 540,210 550,210 534,260 586,260 570,210 580,210"/>
        </g>
      </svg>
    </section>

    <section class="flex items-center justify-center px-6 py-10 sm:px-8">
      <div class="flex w-full max-w-[400px] flex-col gap-3">
        <div>
          <img :src="logo" alt="BioWatcher, gardes forestiers" class="mx-auto mb-6 w-44 sm:w-52"/>
          <h1 class="text-[28px] font-extrabold tracking-tight text-[#1b2a22]">Connexion</h1>
        </div>

        <form
            class="flex flex-col gap-[18px] rounded-2xl border border-[#dce4dd] bg-white p-6 sm:p-7"
            @submit.prevent="submit"
        >
          <p
              v-if="errorMessage"
              role="alert"
              class="rounded-[10px] border border-[#f0b8ae] bg-[#fdf1ee] px-3.5 py-2.5 text-sm text-[#8a1f10]"
          >
            {{ errorMessage }}
          </p>

          <div class="flex flex-col gap-1.5">
            <label for="login" class="text-[13px] text-[#55655b]">Identifiant</label>
            <input
                id="login"
                v-model="form.login"
                type="text"
                autocomplete="username"
                placeholder="Votre identifiant"
                class="min-h-12 rounded-[10px] border border-[#c7d2c9] px-3.5 text-[15px] outline-none focus:border-[#285d49]"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-[13px] text-[#55655b]">Mot de passe</label>
            <div class="relative">
              <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Votre mot de passe"
                  class="min-h-12 w-full rounded-[10px] border border-[#c7d2c9] py-2.5 pl-3.5 pr-12 text-[15px] outline-none focus:border-[#285d49]"
              />
              <button
                  type="button"
                  :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                  class="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center text-[#55655b] hover:text-[#1b2a22]"
                  @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" width="22" height="22" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                     aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                     aria-hidden="true">
                  <path d="M3 3l18 18"/>
                  <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1"/>
                  <path d="M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4.1-.9"/>
                  <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
                </svg>
              </button>
            </div>
          </div>

          <button
              type="submit"
              :disabled="!canSubmit"
              class="min-h-12 cursor-pointer rounded-[10px] bg-[#14352a] text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <RouterLink
            to="/"
            class="flex min-h-11 items-center justify-center text-sm font-bold text-[#14352a] hover:underline"
        >
          Retour à l'accueil
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth.store.js';
import logo from '@/assets/logo.svg';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({login: '', password: ''})
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const canSubmit = computed(() =>
    form.value.login.trim() !== '' && form.value.password !== '' && !loading.value
)

const submit = async () => {
  if (!canSubmit.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    const result = await authStore.login({
      login: form.value.login.trim(),
      password: form.value.password
    });

    if (result.error !== 0) {
      errorMessage.value = result.message || 'Identifiants incorrects';
      form.value.password = '';
      return;
    }

    await router.push('/account')
  } catch (error) {
    console.error('Erreur de connexion :', error);
    errorMessage.value = 'Une erreur est survenue pendant la connexion.';
  } finally {
    loading.value = false;
  }
};
</script>
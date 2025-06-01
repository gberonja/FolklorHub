<template>
    <div class="min-h-[70vh] flex items-center justify-center">
        <div class="text-center px-4">
            <div class="text-red-600 text-9xl font-bold mb-4">404</div>
            <h1 class="text-4xl font-bold mb-6">Stranica nije pronađena</h1>
            <p class="text-gray-600 text-lg mb-8">
                Nažalost, stranica koju tražite ne postoji ili je premještena.
            </p>
            <router-link to="/" class="btn btn-primary px-8 py-3 text-lg">
                Povratak na početnu
            </router-link>
        </div>
    </div>
</template>

<script setup>
</script>
<template>
    <div class="flex flex-col items-center justify-center h-screen font-sans">
        <h1 class="text-4xl mb-6">Selamat Datang di Landing Page!</h1>
        <div class="flex gap-4">
            <nuxt-link to="/file-sharing">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ke File Sharing</button>
            </nuxt-link>
            <nuxt-link to="/instagram-publisher">
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Ke Instagram Publisher</button>
            </nuxt-link>
        </div>
    </div>
</template>

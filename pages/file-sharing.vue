<template>
    <div>
        <div v-if="currrentRoute === ''">
            <div class="text-center">
                <h1 class="text-4xl font-bold mb-4">PyMark Watermarking App</h1>
                <p class="text-gray-700 mb-6">Aplikasi PyMark Watermarking memungkinkan Anda untuk menambahkan watermark pada berbagai jenis file gambar dan melakukan analisis terhadapnya.</p>
                <div class="flex justify-center gap-[10px] mb-4">
                    <NuxtLink @click="changeRoute('embedding')" to="/file-sharing/embedding" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Embedding </NuxtLink>
                    <NuxtLink @click="changeRoute('extraction')" to="/file-sharing/extraction" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Extraction </NuxtLink>
                    <NuxtLink @click="changeRoute('analysis')" to="/file-sharing/analysis" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Analysis </NuxtLink>
                    <NuxtLink @click="changeRoute('image_processing')" to="/file-sharing/image_processing" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Image Processing </NuxtLink>
                    <button @click="filesharing.logout" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300">Logout</button>
                </div>
            </div>
        </div>

        <div v-else>
            <div class="relative">
                <button
                    type="button"
                    class="absolute top-5 right-5 flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    id="user-menu-button"
                    aria-expanded="false"
                    data-dropdown-toggle="user-dropdown"
                    data-dropdown-placement="bottom"
                >
                    <span class="sr-only">Open user menu</span>
                    <img class="w-8 h-8 rounded-full" src="https://avatars.githubusercontent.com/u/71829822?v=4" alt="user photo" />
                </button>
                <!-- Dropdown menu -->
                <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                    <div class="px-4 py-3">
                        <span class="block text-sm text-gray-900 dark:text-white">{{ filesharing.username }}</span>
                        <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ filesharing.email ?? "no email" }}</span>
                    </div>
                    <ul class="py-2" aria-labelledby="user-menu-button">
                        <button @click="filesharing.logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</button>
                    </ul>
                </div>
            </div>
            <div class="md:flex">
                <aside class="w-full md:w-1/3 p-4 flex flex-col">
                    <header>
                        <div class="wrapper text-center">
                            <div class="flex justify-center pt-8 pb-5 md:pt-16 md:pb-10">
                                <img alt="Vue logo" class="logo" src="~/assets/logo/vue.svg" width="125" height="125" />
                            </div>
                            <h1 class="text-3xl font-bold mb-4">PyMark Watermarking App</h1>
                            <p class="text-gray-700 mb-6">Aplikasi PyMark Watermarking memungkinkan Anda dengan mudah menambahkan watermark pada berbagai jenis file gambar dan melakukan analisis terhadapnya.</p>
                            <nav class="flex flex-wrap justify-center md:justify-center">
                                <NuxtLink @click="changeRoute('embedding')" to="/file-sharing/embedding" class="py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300 m-2 md:inline-block">Embedding</NuxtLink>
                                <NuxtLink @click="changeRoute('extraction')" to="/file-sharing/extraction" class="py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300 m-2 md:inline-block">Extraction</NuxtLink>
                                <NuxtLink @click="changeRoute('analysis')" to="/file-sharing/analysis" class="py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300 m-2 md:inline-block">Analysis</NuxtLink>
                                <NuxtLink @click="changeRoute('image_processing')" to="/file-sharing/image_processing" class="py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300 m-2 md:inline-block">Image Processing</NuxtLink>
                            </nav>
                        </div>
                    </header>
                </aside>
                <main class="w-full md:w-2/3 p-4">
                    <NuxtPage />
                </main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const filesharing = useFileSharingStore();
const currrentRoute = ref<string>(useRoute().path.split("/")[2] ?? "");

function changeRoute(route: string) {
    currrentRoute.value = route;
}
</script>

<style scoped>
/* Styling sesuai kebutuhan Anda */
</style>

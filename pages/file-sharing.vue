<template>
    <div v-if="currrentRoute !== ''" class="flex">
        <aside class="w-1/4 p-4 items-center justify-center">
            <!-- Navigasi -->
            <header class="text-center mb-8">
                <div class="flex justify-center gap-[10px]">
                    <NuxtLink @click="changeRoute('embedding')" to="/file-sharing/embedding" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Embedding </NuxtLink>
                    <NuxtLink @click="changeRoute('extraction')" to="/file-sharing/extraction" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Extraction </NuxtLink>
                    <NuxtLink @click="changeRoute('analysis')" to="/file-sharing/analysis" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Analysis </NuxtLink>
                    <NuxtLink @click="changeRoute('image_processing')" to="/file-sharing/image_processing" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Image Processing </NuxtLink>
                    <button @click="filesharing.logout" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300">Logout</button>
                </div>
            </header>
        </aside>

        <main class="w-3/4 p-4">
            <div class="rounded-md p-4">
                <NuxtPage />
            </div>
        </main>
    </div>
    <div v-else>
        <div class="flex justify-center gap-[10px]">
            <NuxtLink @click="changeRoute('embedding')" to="/file-sharing/embedding" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Embedding </NuxtLink>
            <NuxtLink @click="changeRoute('extraction')" to="/file-sharing/extraction" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Extraction </NuxtLink>
            <NuxtLink @click="changeRoute('analysis')" to="/file-sharing/analysis" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Analysis </NuxtLink>
            <NuxtLink @click="changeRoute('image_processing')" to="/file-sharing/image_processing" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300"> Image Processing </NuxtLink>
            <button @click="filesharing.logout" class="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-300">Logout</button>
        </div>
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">
const filesharing = useFileSharingStore();
const currrentRoute = ref<string>(useRoute().path.split("/")[2] ?? "");

function changeRoute(route: string) {
    currrentRoute.value = route;
}
</script>

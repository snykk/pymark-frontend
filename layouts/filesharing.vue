<template>
    <div>
        <div>
            <button
                type="button"
                class="absolute top-5 right-5 flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
            >
                <img class="w-8 h-8 rounded-full" src="https://avatars.githubusercontent.com/u/71829822?v=4" alt="user photo" />
            </button>
            <!-- Dropdown menu -->
            <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                <div class="px-4 py-3">
                    <span class="block text-sm text-gray-900 dark:text-white">{{ filesharing.username }}</span>
                    <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ filesharing.email ?? "no email" }}</span>
                </div>
                <ul class="py-2" aria-labelledby="user-menu-button">
                    <button @click="filesharing.logout" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</button>
                </ul>
            </div>
        </div>
        <div class="md:flex">
            <aside class="w-full md:w-1/3 p-4 flex flex-col">
                <header>
                    <div class="wrapper text-center">
                        <FileSharingIntro class="mb-4 pt-4 pb-2 md:pt-8 md:pb-4" />
                        <nav class="flex flex-wrap justify-center md:justify-center pt-3 xs:pt-6 md:pt-2 lg:pt-6">
                            <NavigationButton label="embedding" to="/file-sharing/embedding" />
                            <NavigationButton label="extraction" to="/file-sharing/extraction" />
                            <NavigationButton label="analysis" to="/file-sharing/analysis" />
                            <NavigationButton label="image processing" to="/file-sharing/image_processing" />
                        </nav>
                    </div>
                </header>
            </aside>
            <main class="w-full md:w-2/3 p-4">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
const filesharing = useFileSharingStore();
</script>

<style scoped></style>

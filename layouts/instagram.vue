<template>
    <div>
        <!-- <div>
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
            <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                <div class="px-4 py-3">
                    <span class="block text-sm text-gray-900 dark:text-white">{{ facebook.username }}</span>
                    <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ facebook.email ?? "no email" }}</span>
                </div>
                <ul class="py-2" aria-labelledby="user-menu-button">
                    <button @click="facebook.logout" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</button>
                </ul>
            </div>
        </div> -->
        <div class="md:flex">
            <aside class="w-full md:w-1/3 p-4 flex flex-col">
                <header>
                    <div class="wrapper text-center">
                        <InstagramPublisherIntro class="mb-4 pt-4 pb-2 md:pt-8 md:pb-4" />
                        <button
                            @click="facebook.logout"
                            type="button"
                            class="text-white bg-gradient-to-br from-lime-600 to-emerald-700 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-lime-500 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            Log out of Facebook
                        </button>
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
const facebook = useFacebookStore();
</script>

<style scoped></style>

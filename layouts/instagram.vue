<template>
    <div>
        <div v-if="isLoading" class="flex justify-center items-center h-screen">
            <div class="flex flex-col justify-center w-1/3">
                <LoadingIndicator class="h-full" :options="defaultOptions" />
                <h1 class="text-center text-xs md:text-xl lg:2xl">Please wait....</h1>
            </div>
        </div>

        <div v-if="!isLoading" class="md:flex">
            <div>
                <button
                    type="button"
                    class="absolute top-5 right-5 flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    id="user-menu-button"
                    @click="isDropdownHidden = !isDropdownHidden"
                >
                    <img class="w-8 h-8 rounded-full" src="https://avatars.githubusercontent.com/u/71829822?v=4" alt="user photo" />
                </button>
                <!-- Dropdown menu -->
                <div :class="{ hidden: isDropdownHidden }" class="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 dropdown-container" id="user-dropdown">
                    <div class="px-4 py-3 cursor-pointer">
                        <span class="block text-sm text-gray-900 dark:text-white">{{ facebook.userName }}</span>
                        <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ facebook.userEmail ?? "no email" }}</span>
                    </div>
                    <ul class="py-2" aria-labelledby="user-menu-button">
                        <button @click="facebook.logout" class="block w-full text-start px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</button>
                    </ul>
                </div>
            </div>
            <aside class="w-full md:w-1/3 p-4 flex flex-col">
                <header>
                    <div class="wrapper text-center">
                        <InstagramPublisherIntro class="mb-4 pt-4 pb-2 md:pt-8 md:pb-4" />
                        <NavigationButton label="post now" to="/instagram-publisher/dashboard" />
                        <NavigationButton label="my post" to="/instagram-publisher/my_post" />
                    </div>
                </header>
            </aside>
            <main class="w-full md:w-2/3 p-4">
                <slot />
                <!-- loading to fetch data -->
                <div class="mx-auto w-1/2 hidden" id="request_loading2">
                    <LoadingIndicator class="h-full w-full" :options="defaultOptions2" />
                    <h1 class="text-2xl text-center">Fetching the data</h1>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import animationData from "~/assets/lotties/loading-animation.json";
import animationData2 from "~/assets/lotties/loading-animation3.json";
const facebook = useFacebookStore();

const defaultOptions = ref({ animationData });
const defaultOptions2 = ref({ animationData: animationData2 });
const isLoading = ref(true);
const isDropdownHidden = ref(true);

onNuxtReady(async () => {
    if (window.FB) {
        window.FB.getLoginStatus(async (response: any) => {
            console.log("masuk sini ya bre");
            if (response.status === "connected") {
                console.log("ya bre");
                facebook.setUserAccessToken(response.authResponse?.accessToken || "");
                facebook.me();
                isLoading.value = false;
            } else {
                await navigateTo("/instagram-publisher");
            }
        });
    }
});
</script>

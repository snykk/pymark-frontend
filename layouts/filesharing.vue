<template>
    <div ref="filesharing_root" :class="$colorMode.value">
        <div class="relative z-50">
            <!-- Tambahkan style="position: relative;" pada div ini -->
            <button type="button" class="fixed top-5 right-5 flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" @click="toggleDropdown">
                <img class="w-8 h-8 rounded-full" src="https://avatars.githubusercontent.com/u/71829822?v=4" alt="user photo" />
            </button>
            <!-- Dropdown menu -->
            <div
                v-if="!isDropdownHidden"
                class="fixed top-11 right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 dropdown-container"
                id="user-dropdown"
                v-click-outside="closeDropdown"
            >
                <div class="px-4 py-3 cursor-pointer">
                    <span class="block text-sm text-gray-900 dark:text-white">{{ filesharing.username }}</span>
                    <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ filesharing.email ?? "no email" }}</span>
                </div>
                <ThemeSwitcherButton class="px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" />
                <ul class="py-2" aria-labelledby="user-menu-button">
                    <button @click="logout" class="block w-full text-start px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</button>
                </ul>
            </div>
        </div>
        <div class="md:flex">
            <aside class="w-full md:w-1/3 p-4 flex flex-col md:sticky md:top-0 md:h-screen overflow-y-auto">
                <!-- this is not scrollable in md screen -->
                <header>
                    <div class="wrapper text-center">
                        <FileSharingIntro class="mb-4 pt-4 pb-2 md:pt-8 md:pb-4" />
                        <nav class="flex flex-wrap justify-center md:justify-center pt-3 xs:pt-6 md:pt-2 lg:pt-6">
                            <NavigationButton label="embedding" to="/file-sharing/embedding" />
                            <NavigationButton label="extraction" to="/file-sharing/extraction" />
                            <NavigationButton label="analysis" to="/file-sharing/analysis" />
                            <NavigationButton label="image processing" to="/file-sharing/image_processing" />
                            <NavigationButton label="my drive" to="/file-sharing/my_drive" />
                        </nav>
                    </div>
                </header>
            </aside>
            <main class="w-full md:w-2/3 p-4 mb-5 overflow-y-auto">
                <!-- scrollable in md screen -->
                <slot />
                <div class="mx-auto w-1/2 hidden" id="loading_submit_request">
                    <LoadingIndicator class="h-full w-full" :options="defaultOptions" />
                    <h1 class="text-2xl text-center">
                        <!-- field handled in script -->
                    </h1>
                </div>
                <div class="mx-auto w-1/2 hidden" id="loading_fetching_data">
                    <LoadingIndicator class="h-full w-full" :options="defaultOptions2" />
                    <h1 class="text-2xl text-center">Fetching the data</h1>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import animationData from "~/assets/lotties/loading-animation2.json";
import animationData2 from "~/assets/lotties/loading-animation3.json";

const colorMode = useColorMode();
const filesharing = useFileSharingStore();
const flasher = useFlashStore();

const isDropdownHidden = ref(true);
const defaultOptions = ref({ animationData });
const defaultOptions2 = ref({ animationData: animationData2 });
const filesharing_root = ref<HTMLElement | null>(null);

onMounted(() => {
    if (process.client) {
        filesharing_root.value?.classList.add(colorMode.value);
        filesharing_root.value?.classList.remove("system");
    }
});

const toggleDropdown = () => {
    isDropdownHidden.value = !isDropdownHidden.value;
};

const closeDropdown = (event: MouseEvent) => {
    const dropdownMenu = document.getElementById("user-dropdown");
    const isClickInsideDropdown = dropdownMenu?.contains(event.target as Node);

    if (!isClickInsideDropdown) {
        // Assuming isDropdownHidden is a reactive variable
        isDropdownHidden.value = true;
    }
};

const logout = () => {
    let timerInterval: NodeJS.Timeout;

    Swal.fire({
        title: "Auto close alert!",
        html: "I will close in <b></b> milliseconds.",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup()!.querySelector("b")!;
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        },
    }).then((result: any) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            // Assuming filesharing and flasher are defined elsewhere
            filesharing.logout();
            flasher.setFlashMessage("Logged out successfully", FlashLabel.SUCCESS);
        }
    });
};
</script>

<style scoped></style>

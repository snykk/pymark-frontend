<template>
    <div :key="componentKey">
        <label :for="label" class="block mb-2 text-sm font-medium">{{ label }}</label>

        <div class="flex items-center">
            <input
                :type="type"
                :id="label"
                :accept="accept"
                ref="fileInput"
                @change="handleFileChange($event)"
                class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <button v-if="file" type="button" @click="deleteFile" class="ml-2 h-full p-2 text-xs text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-center">
                <svg fill="#ffffff" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 457.50 457.50" xml:space="preserve" stroke="#ffffff">
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        <g>
                            <g>
                                <path
                                    d="M381.575,57.067h-90.231C288.404,25.111,261.461,0,228.752,0C196.043,0,169.1,25.111,166.16,57.067H75.929 c-26.667,0-48.362,21.695-48.362,48.362c0,26.018,20.655,47.292,46.427,48.313v246.694c0,31.467,25.6,57.067,57.067,57.067 h195.381c31.467,0,57.067-25.6,57.067-57.067V153.741c25.772-1.02,46.427-22.294,46.427-48.313 C429.936,78.761,408.242,57.067,381.575,57.067z M165.841,376.817c0,8.013-6.496,14.509-14.508,14.509 c-8.013,0-14.508-6.496-14.508-14.509V186.113c0-8.013,6.496-14.508,14.508-14.508c8.013,0,14.508,6.496,14.508,14.508V376.817z M243.26,376.817c0,8.013-6.496,14.509-14.508,14.509c-8.013,0-14.508-6.496-14.508-14.509V186.113 c0-8.013,6.496-14.508,14.508-14.508c8.013,0,14.508,6.496,14.508,14.508V376.817z M320.679,376.817 c0,8.013-6.496,14.509-14.508,14.509c-8.013,0-14.509-6.496-14.509-14.509V186.113c0-8.013,6.496-14.508,14.509-14.508 s14.508,6.496,14.508,14.508V376.817z"
                                />
                            </g>
                        </g>
                    </g>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
const {
    label,
    formSubmitted,
    fileType = "File",
    accept = ".npy",
    type = "file",
} = defineProps({
    label: String,
    formSubmitted: Boolean,
    fileType: String,
    accept: {
        type: String,
        default: ".npy",
    },
    type: {
        type: String,
        default: "file",
    },
});

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref(null);
const file = ref(null);
const componentKey = ref(0);

const handleFileChange = (event) => {
    const target = event.target;
    if (!target || !target.files) return;

    const selectedFile = target.files[0];
    if (!selectedFile) return;

    emit("update:modelValue", selectedFile);
    file.value = selectedFile;
};

const deleteFile = () => {
    file.value = null;
    componentKey.value += 1;
    emit("update:modelValue", null);
};
</script>

<style scoped>
.dark input[type="file"]::file-selector-button {
    @apply bg-gray-600 hover:bg-gray-500 text-white;
}

input[type="file"]::file-selector-button {
    @apply bg-gray-200 hover:bg-gray-300 text-black;
}
</style>

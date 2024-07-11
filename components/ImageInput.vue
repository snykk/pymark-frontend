<template>
    <div class="flex flex-col" :key="componentKey">
        <label class="block mb-2 text-sm font-medium">{{ label }}</label>
        <img v-if="previewSource" :src="previewSource" class="ml-4 h-40 w-40 rounded-lg shadow-md" :alt="alt" />
        <div v-if="imageInfo" class="ml-[3.25rem] text-sm mb-2 mt-1">
            <p>( {{ imageInfo.width }}&#10005;{{ imageInfo.height }} )</p>
        </div>
        <div class="flex items-center">
            <input
                :type="type"
                :id="id"
                :accept="accept"
                class="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                @change="handleImageChange($event)"
            />
            <button
                v-if="previewSource"
                type="button"
                @click="deleteImage"
                class="ml-2 h-full p-2 text-xs text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-center"
            >
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

        <span v-if="formSubmitted && !modelValue" class="text-red-500">{{ errorMessage }}</span>
    </div>
</template>

<script setup lang="ts">
const {
    label,
    id,
    modelValue,
    formSubmitted,
    errorMessage = "Image is required",
    alt = "Preview Image",
    accept = "image/*",
    type = "file",
} = defineProps({
    id: String,
    modelValue: Object,
    label: String,
    formSubmitted: Boolean,
    errorMessage: String,
    alt: String,
    accept: {
        type: String,
        default: "image/*",
    },
    type: {
        type: String,
        default: "file",
    },
});

const emit = defineEmits(["update:modelValue"]);

const previewSource = ref("");
const imageInfo = ref<{ name: string; size: number; type: string; width: number; height: number } | null>(null);
const componentKey = ref(0);

const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target || !target.files) return;

    const file = target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
            emit("update:modelValue", file);
            previewSource.value = result;
            const img = new Image();
            img.onload = () => {
                imageInfo.value = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    width: img.width,
                    height: img.height,
                };
            };
            img.src = result;
        }
    };
    fileReader.readAsDataURL(file);
};

const deleteImage = () => {
    previewSource.value = "";
    imageInfo.value = null;
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

<template>
    <section class="">
        <div class="py-5 px-4 mx-auto max-w-screen-xl lg:pt-10 grid lg:grid-cols-2 gap-5 lg:gap-10">
            <div class="flex flex-col">
                <FileSharingIntro class="mx-auto lg:mt-[5rem]" expandHeadingClass="pb-2 pt-5" />
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="blank" class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center"
                    >Read more about our app
                    <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </a>
            </div>
            <div>
                <div
                    :class="{
                        'lg:mt-12': $route.path.split('/')[3] === 'login',
                    }"
                    class="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800"
                >
                    <slot />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>

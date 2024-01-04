<template>
    <div class="flex flex-col items-center justify-center h-screen font-sans text-center">
        <div class="flex justify-center md:pt-24 md:pb-10">
            <img alt="Vue logo" class="logo" src="~/assets/logo/nuxt.svg" width="125" height="125" />
        </div>
        <h1 class="text-xl md:text-4xl font-bold mb-4">PyMark Watermarking App</h1>
        <p class="text-base md:max-w-2xl mx-auto mb-8">Mark, Secure, and Share: Your go-to for watermarking, and copyright protection. Utilize google drive integration for secure storage, and instagram api for automatic publishing</p>
        <div class="flex flex-wrap justify-center md:justify-center pb-36">
            <NavigationButton label="file sharing" to="/file-sharing" />
            <NavigationButton label="instagram publisher" to="/instagram-publisher" />
        </div>
    </div>
</template>

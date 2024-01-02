// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        // The private keys which are only available within server-side
        my_secret: "",
        // Keys within public, will be also exposed to the client-side
        public: {
            api_base: process.env.PYMARK_BASE_URL,
            facebook_app_id: process.env.FACEBOOK_APP_ID,
        },
    },
    app: {
        head: {
            link: [
                {
                    rel: "stylesheet",
                    href: "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css",
                },
            ],
            script: [
                {
                    id: "facebook-jssdk",
                    src: "https://connect.facebook.net/en_US/sdk.js",
                    defer: true,
                    async: true,
                    crossorigin: "anonymous",
                },
                {
                    src: "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js",
                    body: true, // Placing the script before </body>
                },
            ],
        },
    },
    plugins: [
        { src: "~/plugins/facebook-sdk.ts", mode: "client" },
        // Plugin lainnya...
    ],
    modules: [
        // ...
        "@pinia/nuxt",
    ],
    // hooks: {
    //     "pages:extend"(pages) {
    //         function setMiddleware(pages: NuxtPage[]) {
    //             for (const page of pages) {
    //                 page.meta ||= {};
    //                 // Menetapkan middleware 'check-hard-refresh' ke halaman tertentu berdasarkan kondisi
    //                 page.meta.middleware = ["bruteforce-hidrate"];
    //                 if (page.children) {
    //                     setMiddleware(page.children);
    //                 }
    //             }
    //         }
    //         setMiddleware(pages);
    //     },
    // },
});

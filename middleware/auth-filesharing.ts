export default defineNuxtRouteMiddleware((to, from) => {
    const filesharing = useFileSharingStore();
    const { userJWTToken } = storeToRefs(useFileSharingStore());

    const jwtTOken = useCookie("userJWTToken");
    if (jwtTOken.value) {
        userJWTToken.value = jwtTOken.value;
    }

    // Check if the route matches /file-sharing.vue

    if (!filesharing.userJWTToken) {
        return navigateTo("/auth/file-sharing/login");
    }
    // if (to.params.id === "1") {
    //     return abortNavigation();
    // }
    // // In a real app you would probably not redirect every route to `/`
    // // however it is important to check `to.path` before redirecting or you
    // // might get an infinite redirect loop
    // if (to.path !== "/") {
    //     return navigateTo("/");
    // }
});

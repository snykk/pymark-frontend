export default defineNuxtRouteMiddleware((to, from) => {
    const filesharing = useFileSharingStore();
    const { userJWTToken, username, email } = storeToRefs(useFileSharingStore());

    const jwtTOken = useCookie("userJWTToken");
    if (jwtTOken.value) {
        userJWTToken.value = jwtTOken.value;
    }

    const pymakrUsername = useCookie("pymarkUsername");
    const pymarkEmail = useCookie("pymarkEmail");

    if (pymakrUsername.value && pymarkEmail.value) {
        username.value = pymakrUsername.value;
        email.value = pymarkEmail.value;
    }

    if (!filesharing.userJWTToken) {
        return navigateTo("/file-sharing/auth/login");
    }
});

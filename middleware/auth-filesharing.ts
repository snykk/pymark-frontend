import type BaseApiResponse from "~/types/BaseApiResponse";

const flasher = useFlashStore();

export default defineNuxtRouteMiddleware(async (to, from) => {
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
        flasher.setFlashMessage("You are not authenticated yet", FlashLabel.DANGER);
        return navigateTo("/file-sharing/auth/login?redirectFrom=" + to.fullPath);
    }

    // validate token
    const config = useRuntimeConfig();
    try {
        const response: BaseApiResponse<null> = await $fetch(config.public.api_base + "/users/me", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + filesharing.userJWTToken,
            },
        });
    } catch (error: any) {
        jwtTOken.value = null;
        pymakrUsername.value = null;
        pymarkEmail.value = null;
        flasher.setFlashMessage(error.response._data.message, FlashLabel.DANGER);
        return navigateTo("/file-sharing/auth/login?redirectFrom=" + to.fullPath);
    }
});

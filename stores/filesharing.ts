import { defineStore } from "pinia";
import type LoginFileSharingResponse from "~/types/LoginFileSharingResponse";
import type RegisFileSharingResponse from "~/types/RegisFileSharingResponse";

interface FileSharingStore {
    userJWTToken: string;
    username: string;
    email: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisPayload {
    username: string;
    email: string;
    password: string;
}

export const useFileSharingStore = defineStore("fileSharingStore", {
    state: (): FileSharingStore => ({
        userJWTToken: "", // Load from cookies if available
        username: "",
        email: "",
    }),
    actions: {
        setUserJWTToken(this: FileSharingStore, userJWTToken: string, username: string, email: string) {
            this.userJWTToken = userJWTToken;
            this.username = username;
            this.email = email;

            const jwtToken = useCookie("userJWTToken", {
                maxAge: 60 * 60 * 5, // for 5 hour
            });
            jwtToken.value = userJWTToken;
            const userUsername = useCookie("pymarkUsername", {
                maxAge: 60 * 60 * 5, // for 5 hour
            });
            userUsername.value = username;
            const userEmail = useCookie("pymarkEmail", {
                maxAge: 60 * 60 * 5, // for 5 hour
            });
            userEmail.value = email;
        },

        async regis(this: FileSharingStore, { username, email, password }: RegisPayload) {
            const config = useRuntimeConfig();
            const formData = new FormData();

            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);

            const response = await $fetch<RegisFileSharingResponse>(config.public.api_base + "/auth/regis", {
                method: "POST",
                body: formData,
            });

            return response;
        },

        async login(this: FileSharingStore, { email, password }: LoginPayload) {
            const config = useRuntimeConfig();
            const formData = new FormData();

            formData.append("email", email);
            formData.append("password", password);

            const response = await $fetch<LoginFileSharingResponse>(config.public.api_base + "/auth/login", {
                method: "POST",
                body: formData,
            });

            return response;
        },

        async logout(this: FileSharingStore) {
            console.log("logout nihu");
            this.userJWTToken = "";
            this.username = "";
            this.email = "";
            const userJWTToken = useCookie("userJWTToken");
            userJWTToken.value = null;
            const usernaem = useCookie("pymarkUsername");
            usernaem.value = null;
            const email = useCookie("pymarkEmail");
            email.value = null;

            navigateTo("/file-sharing/auth/login");
        },
    },
});

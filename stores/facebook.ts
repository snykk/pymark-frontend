import { defineStore } from "pinia";

interface FacebookStore {
    userAccessToken: string;
}

export const useFacebookStore = defineStore("facebookStore", {
    state: (): FacebookStore => ({
        userAccessToken: "", // Load from localStorage if available
    }),
    actions: {
        initialize(this: FacebookStore) {
            if (!process.server) {
                this.userAccessToken = localStorage.getItem("userAccessToken") || "";
            }
            console.log("hidrate complete");
        },

        setUserAccessToken(this: FacebookStore, userAccessToken: string) {
            this.userAccessToken = userAccessToken;
        },

        async login(this: FacebookStore) {
            if (window.FB) {
                window.FB.login(
                    (response: fb.StatusResponse) => {
                        this.userAccessToken = response.authResponse?.accessToken || "";
                        localStorage.setItem("userAccessToken", this.userAccessToken); // Save to localStorage
                        if (response.authResponse) {
                            console.log("Welcome! Fetching your information.... ");
                            window.FB.api("/me", (apiResponse: { name: string }) => {
                                console.log("Good to see you, " + apiResponse.name + ".");
                            });
                        } else {
                            console.log("User cancelled login or did not fully authorize.");
                        }
                    },
                    {
                        scope: "instagram_basic,pages_show_list",
                    }
                );
            }
        },

        async logout(this: FacebookStore) {
            if (window.FB) {
                window.FB.logout(() => {
                    this.userAccessToken = "";
                    localStorage.removeItem("userAccessToken"); // Remove from localStorage on logout
                });
            }
        },
    },
});

import { defineStore } from "pinia";

interface FacebookStore {
    userAccessToken: string;
}

export const useFacebookStore = defineStore("facebookStore", {
    state: (): FacebookStore => ({
        userAccessToken: "", // Load from cookies if available
    }),
    actions: {
        setUserAccessToken(this: FacebookStore, userAccessToken: string) {
            this.userAccessToken = userAccessToken;
            // const expirationDate = new Date();
            // expirationDate.setTime(expirationDate.getTime() + 5 * 60 * 60 * 1000); // Set expiration date 5 hours from now

            // const expires = `expires=${expirationDate.toUTCString()}`;
            // document.cookie = `userAccessToken=${encodeURIComponent(this.userAccessToken)}; ${expires}; path=/`; // Save to cookies with expiration date
        },

        async login(this: FacebookStore) {
            if (window.FB) {
                window.FB.login(
                    (response: fb.StatusResponse) => {
                        this.userAccessToken = response.authResponse?.accessToken || "";
                        // const expirationDate = new Date();
                        // expirationDate.setTime(expirationDate.getTime() + 5 * 60 * 60 * 1000); // Set expiration date 5 hours from now

                        // const expires = `expires=${expirationDate.toUTCString()}`;
                        // document.cookie = `userAccessToken=${encodeURIComponent(this.userAccessToken)}; ${expires}; path=/`; // Save to cookies with expiration date

                        if (response.authResponse) {
                            console.log("Welcome! Fetching your information.... ");
                            window.FB.api("/me", (apiResponse: { name: string }) => {
                                console.log("Good to see you, " + apiResponse.name + ".");
                            });
                        } else {
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
                    // document.cookie = "userAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Remove cookie on logout
                });
            }
        },
    },
});

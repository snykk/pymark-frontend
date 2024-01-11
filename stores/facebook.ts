import { defineStore } from "pinia";

interface FacebookStore {
    userAccessToken: string;
    userEmail: string;
}

export const useFacebookStore = defineStore("facebookStore", {
    state: (): FacebookStore => ({
        userAccessToken: "", // Load from cookies if available
        userEmail: "",
    }),
    actions: {
        me(this: FacebookStore) {
            if (this.userAccessToken) {
                console.log("Welcome! Fetching your information.... ");
                window.FB.api("/me?fields=id,email,name", (apiResponse: { id: string; name: string; email: string }) => {
                    console.log(apiResponse);
                    console.log("Good to see you, " + apiResponse.name + ".");
                    console.log("Your email is " + apiResponse.email + ".");

                    // set userEmail
                    this.userEmail = apiResponse.email;
                });
                return;
            }
            console.log("User access token is null");
        },

        setUserAccessToken(this: FacebookStore, userAccessToken: string) {
            this.userAccessToken = userAccessToken;
            // const expirationDate = new Date();
            // expirationDate.setTime(expirationDate.getTime() + 5 * 60 * 60 * 1000); // Set expiration date 5 hours from now

            // const expires = `expires=${expirationDate.toUTCString()}`;
            // document.cookie = `userAccessToken=${encodeURIComponent(this.userAccessToken)}; ${expires}; path=/`; // Save to cookies with expiration date
        },

        login(this: FacebookStore): Promise<string> {
            return new Promise((resolve, reject) => {
                if (window.FB) {
                    window.FB.login(
                        (response: fb.StatusResponse) => {
                            if (response.status === "connected") {
                                this.userAccessToken = response.authResponse?.accessToken || "";
                                // Login successful, resolve the promise with the access token
                                resolve(this.userAccessToken);
                            } else {
                                // Handle login failure
                                console.error("Login failed or user denied access.");
                                // Reject the promise with an error message or code
                                reject(new Error("Login failed or access denied."));
                            }
                        },
                        {
                            scope: "instagram_basic,pages_show_list,email",
                        }
                    );
                } else {
                    // Reject the promise if FB is not available
                    reject(new Error("Facebook SDK not initialized."));
                }
            });
        },

        logout(this: FacebookStore) {
            if (window.FB) {
                window.FB.logout(() => {
                    this.userAccessToken = "";
                    // document.cookie = "userAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Remove cookie on logout
                });
            }

            navigateTo("/instagram-publisher");
        },
    },
});

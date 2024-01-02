// plugins/facebook-sdk.ts
import type { Plugin } from "@nuxt/types";

const initFacebookSDK: Plugin = ({ app }) => {
    const config = useRuntimeConfig();
    const FACEBOOK_APP_ID = config.public.facebook_app_id;

    return new Promise<void>((resolve) => {
        window.fbAsyncInit = () => {
            window.FB?.init?.({
                appId: FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: "v18.0",
            });

            resolve();
        };

        const loadSdkScript = () => {
            const script = document.createElement("script");
            script.id = "facebook-jssdk";
            script.src = "https://connect.facebook.net/en_US/sdk.js";

            const firstScript = document.getElementsByTagName("script")[0];
            if (firstScript.parentNode) {
                firstScript.parentNode.insertBefore(script, firstScript);
            }
        };

        if (!document.getElementById("facebook-jssdk")) {
            loadSdkScript();
        } else {
            window.fbAsyncInit?.();
        }
    });
};

export default initFacebookSDK;

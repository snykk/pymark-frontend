export async function getFacebookPages(userAccessToken: string) {
    try {
        const response = await new Promise((resolve, reject) => {
            window.FB.api("me/accounts", { access_token: userAccessToken }, (response) => {
                if (!response || response.error) {
                    console.error("Error fetching Facebook pages:", response.error);
                    reject(response.error);
                } else {
                    resolve(response.data);
                }
            });
        });
        return response || [];
    } catch (error) {
        console.error("Error fetching Facebook pages:", error);
        return [];
    }
}

export async function getInstagramAccountId(facebookPageId: string, userAccessToken: string) {
    try {
        const response = await new Promise<string | null>((resolve) => {
            window.FB.api(
                facebookPageId,
                {
                    access_token: userAccessToken,
                    fields: "instagram_business_account",
                },
                (response) => {
                    const instagramAccountId = response?.instagram_business_account?.id;
                    if (instagramAccountId) {
                        resolve(instagramAccountId);
                    } else {
                        console.error("Instagram account ID not found");
                        resolve(null);
                    }
                }
            );
        });

        return response || undefined;
    } catch {}
}

export function createMediaObjectContainer(instagramAccountId: string, userAccessToken: string, imageUrl: string, postCaption: string) {
    return new Promise<string | null>((resolve) => {
        window.FB.api(
            `${instagramAccountId}/media`,
            "post",
            {
                access_token: userAccessToken,
                image_url: imageUrl,
                caption: postCaption,
            },
            (response) => {
                resolve(response.id || null);
            }
        );
    });
}

export function publishMediaObjectContainer(instagramAccountId: string, userAccessToken: string, mediaObjectContainerId: string) {
    return new Promise<string | null>((resolve) => {
        window.FB.api(
            `${instagramAccountId}/media_publish`,
            "post",
            {
                access_token: userAccessToken,
                creation_id: mediaObjectContainerId,
            },
            (response) => {
                resolve(response.id || null);
            }
        );
    });
}

// store/flashStore.ts
import { defineStore } from "pinia";

// Define enums for info types
export enum FlashLabel {
    SUCCESS = "success",
    DANGER = "danger",
    INFO = "info",
}

export const useFlashStore = defineStore({
    id: "flash",
    state: () => ({
        message: "",
        label: "",
    }),
    actions: {
        setFlashMessage(message: string, label: string) {
            this.message = message;
            this.label = label;
        },
        clearFlashMessage() {
            this.message = "";
            this.label = "";
        },
    },
    getters: {
        flashMessage: (state) => state.message,
        flashLabel: (state) => state.label,
    },
});

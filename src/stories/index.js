import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { ENV } from "@/config";

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
    // middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(...[]),
    devTools: ENV === 'development'
})
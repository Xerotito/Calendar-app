import { configureStore } from "@reduxjs/toolkit";
import { authSlice, calendarSlice, uiSlice } from "./";


export const store = configureStore({
    reducer: {
        auth    : authSlice.reducer,
        calendar: calendarSlice.reducer,
        ui      : uiSlice.reducer,
    },
    //Evitamos la serialization de las fechas tipo date a string.
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
}) 
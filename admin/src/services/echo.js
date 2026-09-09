
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "reverb",

    key: import.meta.env.VITE_REVERB_APP_KEY,

    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
    wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,

    forceTLS: false,

    enabledTransports: ["ws", "wss"],

    authEndpoint: import.meta.env.VITE_BACKEND_URL + "/broadcasting/auth",

    auth: {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer 384|504OEuZ59I2JWmBEIo5uVHI575C7DMeA3WDR1Xrx13cfe12b`,
        },
    },
});

export default window.Echo;
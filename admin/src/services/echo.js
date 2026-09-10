
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const token= localStorage.getItem('auth_token');


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
            Authorization: `Bearer ${token}`,
        },
    },
});

export default window.Echo;
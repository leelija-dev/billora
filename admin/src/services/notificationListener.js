import echo from "./echo";

const playOrderSound = () => {
    const audio = new Audio("/sound/order-notification.mp3");

    audio.volume = 1;

    audio.play()
        .then(() => {
            console.log("🔊 New order sound played");
        })
        .catch((error) => {
            console.error("❌ Audio playback blocked:", error);
        });
};

export const listenForNotifications = (adminId, callback) => {

    if (!adminId) {
        console.error("❌ No admin ID");
        return;
    }

    const channelName = `App.Models.Customers.${adminId}`;

    console.log("🔌 Subscribing to:", channelName);
    console.log("👤 Admin ID:", adminId);

    const channel = echo.private(channelName);

    channel.subscribed(() => {
        console.log("✅ Successfully subscribed:", channelName);
    });

    channel.error((error) => {
        console.error("❌ Private channel authentication error:", error);
    });

    channel.listen(".new-order", (event) => {

        console.log("🔔 New order received:", event);
        playOrderSound();   

        callback(event);
    });

    return () => {
        console.log("🔌 Leaving:", channelName);

        echo.leave(channelName);
    };
};

// Auto-start notification listener when auth_token is stored
let currentUnsubscribe = null;
let notificationCallback = null;
let lastAuthToken = null;
let checkInterval = null;

export const setupAutoNotificationListener = (callback) => {
    if (typeof window === 'undefined') return;

    notificationCallback = callback;

    const startListener = () => {
        const authToken = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');

        if (authToken && userStr) {
            try {
                const user = JSON.parse(userStr);
                const adminId = user?.id;

                if (adminId && !currentUnsubscribe) {
                    console.log("🚀 Auto-starting notification listener for admin:", adminId);
                    currentUnsubscribe = listenForNotifications(adminId, notificationCallback);
                }
            } catch (error) {
                console.error("❌ Error parsing user data:", error);
            }
        }
    };

    const stopListener = () => {
        if (currentUnsubscribe) {
            console.log("🛑 Stopping notification listener");
            currentUnsubscribe();
            currentUnsubscribe = null;
        }
    };

    // Check on initial load
    lastAuthToken = localStorage.getItem('auth_token');
    startListener();

    // Watch for auth_token changes (cross-tab)
    const handleStorageChange = (event) => {
        if (event.key === 'auth_token') {
            if (event.newValue) {
                // auth_token was added/updated
                console.log("🔑 auth_token detected (cross-tab), starting notification listener");
                startListener();
            } else if (event.oldValue && !event.newValue) {
                // auth_token was removed
                console.log("🔑 auth_token removed (cross-tab), stopping notification listener");
                stopListener();
            }
        }
    };

    // Also watch for user changes (might happen during auth sync)
    const handleUserChange = (event) => {
        if (event.key === 'user') {
            const authToken = localStorage.getItem('auth_token');
            if (authToken && event.newValue) {
                console.log("👤 user data changed (cross-tab), restarting notification listener");
                stopListener();
                startListener();
            }
        }
    };

    // Poll for same-tab changes (during login/logout in current tab)
    checkInterval = setInterval(() => {
        const currentAuthToken = localStorage.getItem('auth_token');
        
        if (currentAuthToken !== lastAuthToken) {
            console.log("🔑 auth_token changed (same-tab)");
            lastAuthToken = currentAuthToken;
            
            if (currentAuthToken) {
                console.log("🔑 auth_token added (same-tab), starting notification listener");
                startListener();
            } else {
                console.log("🔑 auth_token removed (same-tab), stopping notification listener");
                stopListener();
            }
        }
    }, 500); // Check every 500ms

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleUserChange);

    // Return cleanup function
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('storage', handleUserChange);
        if (checkInterval) clearInterval(checkInterval);
        stopListener();
    };
};
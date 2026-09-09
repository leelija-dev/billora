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
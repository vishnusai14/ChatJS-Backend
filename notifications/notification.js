const { Expo } = require("expo-server-sdk")
const sendPushNotification = async (targetExpoPushToken, message) => {
    if(targetExpoPushToken === undefined) {
      return
    }
    console.log("Notification Arrived" , targetExpoPushToken)
    const expo = new Expo()
    const chunks = expo.chunkPushNotifications([
      { to: targetExpoPushToken, sound: "default", body: message }
    ])

    for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
}

module.exports = sendPushNotification 
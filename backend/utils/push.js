const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

const sendPushNotification = async (user, payload) => {
  if (!user.pushSubscriptions || user.pushSubscriptions.length === 0) return;

  const notifications = user.pushSubscriptions.map(subscription => {
    return webpush.sendNotification(subscription, JSON.stringify(payload))
      .catch(err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription has expired or is no longer valid, we should remove it
          return 'REMOVE';
        }
        console.error('Error sending push notification:', err);
      });
  });

  const results = await Promise.all(notifications);
  
  // Cleanup invalid subscriptions
  if (results.includes('REMOVE')) {
    const validSubscriptions = user.pushSubscriptions.filter((_, index) => results[index] !== 'REMOVE');
    user.pushSubscriptions = validSubscriptions;
    await user.save();
  }
};

module.exports = { sendPushNotification };

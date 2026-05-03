require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const { sendPushNotification } = require('./utils/push');

const testPush = async () => {
  console.log('PUBLIC_VAPID_KEY:', process.env.PUBLIC_VAPID_KEY);
  console.log('PRIVATE_VAPID_KEY:', process.env.PRIVATE_VAPID_KEY);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({ 'pushSubscriptions.0': { $exists: true } });
    console.log(`Found ${users.length} users with push subscriptions.`);

    for (const user of users) {
      console.log(`Sending push to user: ${user.name}`);
      await sendPushNotification(user, {
        title: 'Test Notification 🎒',
        body: 'Testing the updated icon and push system!',
        url: '/'
      });
    }

    console.log('Push test completed.');
    process.exit(0);
  } catch (err) {
    console.error('Push test error:', err);
    process.exit(1);
  }
};

testPush();

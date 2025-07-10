// controller/Mail.tracker.controller.js
const trackerModel = require('../model/tracker.model');

// exports.trackOpen = async (req, res) => {
//   const { token } = req.params;
//   console.log('🎯 Pixel hit for token:', token);

//   try {
//     // Implement markAsOpened(token) to UPDATE opened = true, opened_at = NOW()
//     await trackingModel.markAsOpened(token);
//   } catch (err) {
//     console.error('Error marking opened:', err);
//   }

//   // Return a transparent 1×1 GIF
//   const pixel = Buffer.from(
//     'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
//     'base64'
//   );
//   res.setHeader('Content-Type', 'image/gif');
//   res.send(pixel);
// };
const path = require('path');

exports.trackOpen = async (req, res) => {
  const token = req.params.token;

  try {
    await trackerModel.markAsOpened(token);
    console.log(`✅ Tracking hit for token: ${token}`);
  } catch (err) {
    console.error(`❌ Failed to track: ${err.message}`);
  }

  // ✅ Send a real image instead of a transparent pixel
   const imgPath = path.join(__dirname, '../public/test-image.png');
  console.log('📷 Image Path:', imgPath);
  res.set('Content-Type', 'image/png');
  res.sendFile(imgPath);
};
exports.getAllTrackers = async (req, res) => {
  try {
    const data = await trackerModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};

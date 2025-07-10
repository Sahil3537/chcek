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
  const { token } = req.params;

  try {
    // Log request details for debugging
    console.log(`✅ Tracking hit for token: ${token} at ${new Date()}`);
    console.log(`User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
    console.log(`Client IP: ${req.ip || 'Unknown'}`);

    // Update tracking status in the database
    await trackerModel.markAsOpened(token);

    // Send a 1x1 transparent GIF
    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64'));
  } catch (err) {
    console.error(`❌ Failed to track token ${token}: ${err.message}`);
    // Send the transparent GIF even if tracking fails to avoid breaking the email client
    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64'));
  }
};
exports.getAllTrackers = async (req, res) => {
  try {
    const data = await trackerModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};

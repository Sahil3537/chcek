const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const trackingModel = require('../model/tracker.model');
const generateEmail = require('../views/views');

// Already defined: sendEmail function...

exports.trackOpen = async (req, res) => {
  const token = req.params.token;

  try {
     const row = await trackingModel.getByToken(token);

  if (!row) {
    return res.status(404).send('❌ Invalid token');
  }

  // ✅ Update opened status
  if (!row.opened) {
    await trackingModel.markAsOpened(token);
  }
   
    // Transparent 1x1 GIF (base64 encoded)
    const pixel = Buffer.from(
      'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      'base64'
    );

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', pixel.length);
    res.end(pixel, 'binary');
  } catch (error) {
    console.error('❌ Error tracking open:', error);
    res.status(500).send('Tracking failed');
  }
};



// controller/email.controller.js or tracker.controller.js



exports.getAllTrackers = async (req, res) => {
  try {
    const data = await trackingModel.getAll(); // SELECT * FROM tracker
    console.log(data)
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tracking data' });
  }
};

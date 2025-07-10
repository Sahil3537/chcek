// utils/pixel.utils.js
const { v4: uuidv4 } = require('uuid');
const trackingModel = require('../model/tracker.model');
require('dotenv').config();

exports.generateToken = async (email) => {
  const token = uuidv4();
  // Save to DB: implement saveTracking(email, token) to INSERT
  await trackingModel.saveTracking(email, token);

  const base = process.env.BASE_URL; // e.g. "https://xyz.ngrok-free.app"
  return `<img src="${base}/api/track/${token}" width="1" height="1" style="display:none;" />`;
};

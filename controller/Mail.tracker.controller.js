
exports.trackOpen = async (req, res) => {
  const { token } = req.params;

  try {
    console.log(`✅ Tracking hit for token: ${token} at ${new Date()}`);
    console.log(`User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
    console.log(`Client IP: ${req.ip || 'Unknown'}`);

    const tracker = memoryStore.trackers.find(t => t.token === token);
    if (tracker && !tracker.opened) {
      tracker.opened = true;
      tracker.openedAt = new Date();
    }

    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64'));
  } catch (err) {
    console.error(`❌ Failed to track token ${token}: ${err.message}`);
    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64'));
  }
};

exports.getAllTrackers = async (req, res) => {
  try {
    res.json({ success: true, data: memoryStore.trackers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};

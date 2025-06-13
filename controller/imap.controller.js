const { simpleParser } = require('mailparser');
const Imap = require('imap');
require('dotenv').config();

exports.receiveEmail = (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const messages = [];

    const imap = new Imap({
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASS,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 10000,
      tlsOptions: {
        rejectUnauthorized: false // ⚠️ For development only
      }
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          console.error('❌ Failed to open mailbox:', err);
          imap.end();
          return res.status(500).json({ success: false, error: 'Failed to open mailbox' });
        }

        const total = box.messages.total;
        if (total === 0) {
          imap.end();
          return res.json({ success: true, emails: [] });
        }

        const start = Math.max(total - offset - limit + 1, 1);
        const end = total - offset;
        const range = `${start}:${end}`;

        const fetch = imap.seq.fetch(range, { bodies: '', struct: true });
        const parserPromises = [];

        fetch.on('message', (msg) => {
          const parserPromise = new Promise((resolve, reject) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) return reject(err);

                messages.push({
                  from: parsed.from?.text || '',
                  to: parsed.to?.text || '',
                  subject: parsed.subject || '',
                  date: parsed.date || '',
                  text: parsed.text || '',
                  html: parsed.html || ''
                });

                resolve();
              });
            });
          });
          parserPromises.push(parserPromise);
        });

        fetch.once('error', (fetchErr) => {
          console.error('❌ Fetch error:', fetchErr);
          imap.end();
          return res.status(500).json({ success: false, error: 'Fetch error' });
        });

        fetch.once('end', async () => {
          try {
            await Promise.all(parserPromises);

            // 🔄 Sort by newest first
            const sorted = messages.sort((a, b) => new Date(b.date) - new Date(a.date));

            imap.end();
            return res.json({ success: true, emails: sorted });
          } catch (err) {
            console.error('❌ Parser error:', err);
            imap.end();
            return res.status(500).json({ success: false, error: 'Parsing failed' });
          }
        });
      });
    });

    imap.once('error', (err) => {
      console.error('❌ IMAP Error:', err);
      if (!res.headersSent) {
        return res.status(500).json({ success: false, error: 'IMAP connection error', details: err.message });
      }
    });

    imap.connect();
  } catch (err) {
    console.error('❌ Outer Catch Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};

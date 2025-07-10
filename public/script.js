// Set your backend URL (update the ngrok link if needed)
const backendBase = "https://6f70b602526b.ngrok-free.app"; // 🔁 update ngrok link here
const backendUrl = `${backendBase}/api`;

// Handle send email
document.getElementById('emailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const to = document.getElementById('to').value;
  const subject = document.getElementById('subject').value;
  const userHtml = document.getElementById('html').value;

  const html = userHtml + `<img src="${backendBase}/api/track/__REPLACE_TOKEN__" width="1" height="1" style="display:none;" />`;

  try {
    const res = await axios.post(`${backendUrl}/send`, {
      to, subject, html, service: 'gmail'
    });
    document.getElementById('sendResult').innerHTML =
      `<div class="alert alert-success">✅ Email sent to ${to}</div>`;
    document.getElementById('emailForm').reset();
  } catch (err) {
    document.getElementById('sendResult').innerHTML =
      `<div class="alert alert-danger">❌ Failed to send: ${err.response?.data?.message || err.message}</div>`;
  }
});

// Load tracking status
document.getElementById('loadStatus').addEventListener('click', async () => {
  try {
    const res = await axios.get(`${backendUrl}/track`);
    const trackers = res.data.data || [];

    if (!trackers.length) {
      document.getElementById('trackerTable').innerHTML = '<p>No tracking data found.</p>';
      return;
    }

    let table = `<table class="table table-bordered table-hover">
      <thead><tr><th>#</th><th>Email</th><th>Token</th><th>Status</th><th>Opened At</th></tr></thead><tbody>`;

    trackers.forEach((item, index) => {
      table += `<tr>
        <td>${index + 1}</td>
        <td>${item.email}</td>
        <td>${item.token}</td>
        <td>${item.opened ? '✅ Opened' : '⌛ Not Opened'}</td>
        <td>${item.opened_at || '-'}</td>
      </tr>`;
    });

    table += '</tbody></table>';
    document.getElementById('trackerTable').innerHTML = table;

  } catch (err) {
    document.getElementById('trackerTable').innerHTML =
      `<div class="alert alert-danger">❌ Failed to load tracking data</div>`;
  }
});

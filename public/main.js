// Define your backend base URL
const backendUrl = window.location.origin.includes('localhost')
  ? 'http://localhost:3000/api'
  : 'https://6f70b602526b.ngrok-free.app/api'; // 🔁 Replace with your actual ngrok or deployed backend

// Function to fetch tracking data and populate the table
async function loadTrackingData() {
  const tableContainer = document.getElementById('trackerTable');
  tableContainer.innerHTML = '<p>Loading...</p>';

  try {
    const res = await fetch(`${backendUrl}/track`);
    const result = await res.json();

    const trackers = result.data || [];

    if (!trackers.length) {
      tableContainer.innerHTML = '<p>No tracking data found.</p>';
      return;
    }

    let tableHTML = `
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Token</th>
            <th>Status</th>
            <th>Opened At</th>
          </tr>
        </thead>
        <tbody>`;

    trackers.forEach((item, index) => {
      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.email}</td>
          <td>${item.token}</td>
          <td>${item.opened ? '✅ Opened' : '⌛ Not Opened'}</td>
          <td>${item.opened_at || '-'}</td>
        </tr>`;
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;

  } catch (error) {
    tableContainer.innerHTML = `
      <div class="alert alert-danger">
        ❌ Error loading tracking data: ${error.message}
      </div>`;
  }
}

// Event listener for refresh button
document.getElementById('refreshBtn').addEventListener('click', loadTrackingData);

// Auto-load on page load
window.addEventListener('DOMContentLoaded', loadTrackingData);

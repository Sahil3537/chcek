module.exports = (token) => `
  <div>
    <h1>Welcome!</h1>
    <p>This email has a tracking pixel below.</p>
    <img src="https://6f70b602526b.ngrok-free.app/api/track/${token}" width="1" height="1" style="display: none;" />
  </div>
`;

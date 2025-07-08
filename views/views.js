
module.exports = (token) => `
  <div>
    <h1>Welcome!</h1>
    <p>This email has a tracking pixel below.</p>
    <img src="http://localhost:3000/track/${token}" width="1" height="1" />
  </div>
`;

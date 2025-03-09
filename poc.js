const crypto = require('crypto');
password = "ian"

const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log(hash);

// Add fetch request to the endpoint
fetch(`http://localhost:8000/login?password=${password}&%E3%85%A4=${hash}`)
  .then(response => response.text())
  .then(data => console.log('Response:', data))
  .catch(error => console.error('Error:', error));
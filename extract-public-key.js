
const crypto = require('crypto');

// Get the private key from environment
const privateKeyPem = process.env.DKIM_PRIVATE_KEY;

if (!privateKeyPem) {
  console.error('DKIM_PRIVATE_KEY not found in environment variables');
  process.exit(1);
}

try {
  // Create a key object from the private key
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  
  // Extract the public key
  const publicKey = crypto.createPublicKey(privateKey);
  
  // Export as PEM format
  const publicKeyPem = publicKey.export({
    type: 'spki',
    format: 'pem'
  });
  
  // Remove PEM headers and format for DNS
  const publicKeyBase64 = publicKeyPem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\n/g, '')
    .trim();
  
  console.log('\n=== DKIM PUBLIC KEY FOR DNS ===');
  console.log('Add this TXT record to your DNS:');
  console.log('\nRecord Type: TXT');
  console.log('Name/Host: default._domainkey.niddik.com');
  console.log('Value/Content:');
  console.log(`"v=DKIM1; k=rsa; p=${publicKeyBase64}"`);
  console.log('\n=== END ===\n');
  
} catch (error) {
  console.error('Error extracting public key:', error.message);
  process.exit(1);
}

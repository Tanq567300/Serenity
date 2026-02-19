const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (i.e. 127.0.0.1) and non-ipv4 addresses
            // Also assume the correct one is usually 192.168.x.x or 10.x.x.x or 172.x.x.x
            if (iface.family === 'IPv4' && !iface.internal) {
                // Return the first standard private IP found
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // Fallback
}

const ip = getLocalIpAddress();
const configPath = path.join(__dirname, '../src/config.js');
const port = 5000; // Backend port

const content = `export const API_URL = 'http://${ip}:${port}/api';\n`;

console.log(`📡 Configuring API_URL to: http://${ip}:${port}/api`);

try {
    fs.writeFileSync(configPath, content);
    console.log('✅ src/config.js updated successfully.');
} catch (err) {
    console.error('❌ Failed to update config.js:', err);
}

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Simple IP validation (optional)
const isValidIP = (ip) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
};

// Path to the log file
const logFilePath = path.join(__dirname, 'ip_log.json');

// Function to read and append the IP to the JSON file
const logIPToFile = (ip) => {
    return new Promise((resolve, reject) => {
        // Check if the log file exists
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            let logData = [];
            if (err && err.code === 'ENOENT') {
                // If the file doesn't exist, initialize with an empty array
                logData = [];
            } else if (err) {
                return reject('Error reading the log file');
            } else {
                try {
                    // Parse the existing log file content
                    logData = JSON.parse(data);
                } catch (e) {
                    return reject('Error parsing the log file content');
                }
            }

            // Add the new IP address with the current timestamp
            logData.push({ ip, timestamp: new Date().toISOString() });

            // Write the updated log data back to the file
            fs.writeFile(logFilePath, JSON.stringify(logData, null, 2), 'utf8', (err) => {
                if (err) {
                    return reject('Error writing to the log file');
                }
                resolve();
            });
        });
    });
};

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const { ip } = JSON.parse(event.body);
        
        // Validate IP format
        if (!ip || !isValidIP(ip)) {
            return {
                statusCode: 400,
                body: 'Invalid IP address provided',
            };
        }

        // Log the IP locally to the JSON file
        await logIPToFile(ip);

        // Discord webhook URL
        const webhookUrl = 'https://discordapp.com/api/webhooks/1306923540418924595/bs9LVhT5wNKgAdqXmOzWgiVriiQebWHCXCRimxfz4ZTY7MLsUgL5o81RJelQWapDZ2JG';

        // Message to be sent to Discord
        const message = {
            content: `Ny IP-adresse logget: ${ip}`,
        };

        // Send the request to Discord
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });

        // Check if the response from Discord was successful
        if (!response.ok) {
            throw new Error(`Failed to send message to Discord: ${response.statusText}`);
        }

        return {
            statusCode: 200,
            body: 'IP logged locally and sent to Discord',
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};

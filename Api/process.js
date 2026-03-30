export default async function handler(req, res) {
    // Sirf POST request allow karein
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST allowed' });
    }

    try {
        const { image, mimeType } = JSON.parse(req.body);
        
        // Vercel Environment Variable se Key uthayega
        const API_KEY = process.env.AIzaSyAdHFRbdVM5Ac_qUqpDVHTkcXB3CFoCvPw; 

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Analyze this image. Tell me exactly how to improve its quality, brightness, and colors to make it look professional." },
                        { inline_data: { mime_type: mimeType, data: image } }
                    ]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Server Error: " + error.message });
    }
}

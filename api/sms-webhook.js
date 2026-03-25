export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  const { From, Body, To, MessageSid } = req.body || {};
  if (!From || !Body) {
    return res.status(400).json({ error: 'Missing From or Body' });
  }
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (discordWebhookUrl) {
    try {
      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '📱 **Inbound SMS** from **' + From + '**:\n> ' + Body + '\n\n_SID: ' + MessageSid + ' → ' + To + '_',
        }),
      });
    } catch (e) {
      console.error('Discord webhook failed:', e.message);
    }
  }
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send('<Response></Response>');
}

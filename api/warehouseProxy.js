export default async function handler(req, res) {
  const target = `https://system-inventory-management.onrender.com${req.url.replace('/api/warehouseProxy', '')}`;
  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

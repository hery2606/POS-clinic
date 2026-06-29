export default async function handler(req, res) {
  let targetPath = req.query.targetPath || '';
  targetPath = targetPath.replace(/\.\./g, '').replace(/^(https?:)?\/\//, '');
  
  const baseUrl = process.env.API_BASE_URL ;
  const target = `${baseUrl}/${targetPath}`;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

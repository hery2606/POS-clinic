export default async function handler(req, res) {
  let targetPath = req.query.targetPath || '';
  
  // Sanitasi path untuk mencegah Directory Traversal dan SSRF Protocol redirection
  targetPath = targetPath
    .replace(/\.\./g, '')
    .replace(/^(https?:)?\/\//, '');

  const target = `https://system-inventory-management.onrender.com/${targetPath}`;
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

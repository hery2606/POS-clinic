export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const email = process.env.WAREHOUSE_ADMIN_EMAIL;
  const password = process.env.WAREHOUSE_ADMIN_PASSWORD;

  if (!email || !password) {
    return res.status(500).json({ error: 'Warehouse admin credentials are not configured on the server.' });
  }

  try {
    const targetUrl = process.env.VITE_API_WAREHOUSE_URL || 'https://system-inventory-management.onrender.com';
    const response = await fetch(`${targetUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Authentication failed: ${errorText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

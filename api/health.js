export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'API funcionando',
    timestamp: new Date().toISOString(),
    DB_TYPE: process.env.DB_TYPE || 'no definido',
    has_DATABASE_URL: !!process.env.DATABASE_URL
  });
}

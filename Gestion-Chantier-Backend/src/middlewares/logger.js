const db = require('../models');

const logger = async (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function(body) {
    const duration = Date.now() - start;
    
    // Enregistrement asynchrone sans bloquer la réponse
    setTimeout(async () => {
      try {
        await db.Log.create({
          action: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
          niveau: res.statusCode >= 400 ? 'error' : 'info',
          user_id: req.user?.id || null,
          ip_address: req.ip,
          user_agent: req.get('user-agent'),
          endpoint: req.originalUrl,
          method: req.method,
          details: JSON.stringify({
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            bodySize: body?.length || 0
          })
        });
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du log:', error);
      }
    }, 0);
    
    originalSend.call(this, body);
  };
  
  next();
};

module.exports = logger;
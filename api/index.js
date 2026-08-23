let app;
try {
  app = require('../server/src/app');
} catch (err) {
  console.error('[API Entry Point Error]', err);
  app = (req, res) => {
    res.status(500).json({ error: 'Server initialization error', details: err.message });
  };
}

module.exports = app;

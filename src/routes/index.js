const router = require('express').Router();
const mondayRoutes = require('./monday');
const statusRoutes = require('./status')

router.use(mondayRoutes);
router.use(statusRoutes);

router.get('/', function (req, res) {
  res.json(getHealth());
});

router.get('/health', function (req, res) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

module.exports = router;

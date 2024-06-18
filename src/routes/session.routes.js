const { Router } = require('express');
const { getSession, postSession}= require('../controllers/session.controller');

const router = Router();

router.get('/session', getSession);

router.post('/session', postSession);

module.exports = router;
const { Router } = require('express');
const { getSession, postSession}= require('../controllers/session.controller');

const router = Router();

router.get('/estudiante/session', getSession);


router.post('/estudiante/session', postSession);

module.exports = router;
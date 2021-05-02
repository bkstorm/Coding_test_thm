const express = require('express');
const { to } = require('await-to-js');

const router = express.Router();
const { authenticateUser } = require('../services/user.service');

router.post('/login', async (req, res) => {
  const [error, user] = await to(
    authenticateUser(req.body.email, req.body.password),
  );
  if (error) {
    return res.status(401).send();
  }
  return res.status(200).json(user);
});

module.exports = router;

const express = require('express');
const { to } = require('await-to-js');

const router = express.Router();
const { getUser, updateUser } = require('../services/user.service');

router.get('/users/:id', async (req, res) => {
  const [error, user] = await to(getUser(req.params.id));
  if (error) {
    return res.status(404).send();
  }
  return res.status(200).json(user);
});

router.put('/users/:id', async (req, res) => {
  if (req.user && req.user.id !== req.params.id) {
    return res.status(403).send('Forbidden');
  }
  const [error, user] = await to(updateUser(req.params.id, req.body));
  if (error && error.message === 'User not found') {
    return res.status(404).send();
  }
  if (error) {
    return res.status(500).send(error.message);
  }
  return res.status(200).json(user);
});

module.exports = router;

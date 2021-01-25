const express = require('express');
const Widgets = require('../models/widgets');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const widgets = await Widgets.find();
  res.json(widgets);
});

router.get('/byUser', Auth.check, async (req, res) => {
  const widgets = await Widgets.find({ author: req.user._id });
  res.json(widgets);
});

router.get('/:id', async (req, res) => {
  const widgets = await Widgets.findOne({ _id: req.params.id });
  res.json(widgets);
});

router.post('/create', Auth.check, async (req, res) => {
  req.body.author = req.user._id;
  const newWidget = await new Widgets(req.body).save();
  console.log(newWidget);
  res.json(newWidget);
});

router.put('/:id', async (req, res) => {
  const widgets = await Widgets.updateOne({ _id: req.params.id }, { $set: req.body });
  res.json(widgets);
});

router.delete('/:id', async (req, res) => {
  const widgets = await Widgets.deleteOne({ _id: req.params.id });
  res.json(widgets);
});

module.exports = router;

const express = require('express');
const Widgets = require('../../models/widgets');

const router = express.Router();

router.get('/', async (req, res) => {
  const widgets = await Widgets.find();
  res.json(widgets);
});

router.get('/:id', async (req, res) => {
  const widgets = await Widgets.find({ _id: req.params.id });
  res.json(widgets);
});

router.post('/', async (req, res) => {
  const newWidget = await new Widgets(req.body).save();
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

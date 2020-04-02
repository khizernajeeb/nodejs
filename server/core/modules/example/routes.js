const express = require('express');
const ExampleController = require('./controller');

const router = express.Router();

router.get('/sample', ExampleController.exampleMethod);

module.exports = router;

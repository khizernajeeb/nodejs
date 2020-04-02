
const ExampleService = require('./service');

async function exampleMethod(req, res) {
  const details = req.query.getDetails || true;

  try {
    const response = {
      success: true,
    };

    if (details) {
      response.data = await ExampleService.getSampleData();
    }
    res.send(response);
  } catch (e) {
    res.status(500).send({ success: false, msg: 'An error occurred' });
  }
}

module.exports = {
  exampleMethod,
};

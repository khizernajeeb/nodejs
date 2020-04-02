const Repository = require('./index');

const models = require('../db/models/index');


class ExampleRepo extends Repository {
  // eslint-disable-next-line no-useless-constructor
  constructor(exampleModel) {
    super(exampleModel);
  }
}

module.exports = new ExampleRepo(models.example);



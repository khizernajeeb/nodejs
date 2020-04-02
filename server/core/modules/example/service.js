
const repo = require('../../repositories/example');

function getSampleData() {
  return repo.findAllRecords();
}

module.exports = {
  getSampleData,
};

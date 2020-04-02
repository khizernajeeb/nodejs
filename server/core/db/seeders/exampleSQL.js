module.exports = {
  up: async queryInterface =>
    queryInterface.bulkInsert(
      'example',
      [
        {
          title: 'Example',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    ),

  down: queryInterface => queryInterface.bulkDelete('example', null, {}),
};

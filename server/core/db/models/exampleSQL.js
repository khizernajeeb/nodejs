module.exports = (sequelize, DataTypes) => {
  const Example = sequelize.define(
    'example',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id', // Will result in an attribute that is firstName when user facing but first_name in the database
      },
      title: {
        type: DataTypes.STRING,
        field: 'title', // Will result in an attribute that is firstName when user facing but first_name in the database
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );

  Example.associate = models => {
    // models.example.hasMany(models.example);
  };

  return Example;
};

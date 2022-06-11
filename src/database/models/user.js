module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    displayName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  })
  User.associate = (models) => {
    User.hasMany(models.BlogPost, {
      as: 'blogposts',
      foreignKey: 'id'
    })
  }
  return User
};
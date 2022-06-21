module.exports = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define('PostCategory', {
    postId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'BlogPosts',
        foreignKey: 'id'
      }
    },
    categoryId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        foreignKey: 'id'
      }
    },
  }, {timestamps: false})
  PostCategory.associate = (models) => {
    models.BlogPost.belongsToMany(models.Category, {
      as: 'BlogPosts',
      through: PostCategory,
      foreignKey: 'postId',
      otherKey: 'categoryId'
    })
    models.Category.belongsToMany(models.BlogPost, {
      as: 'BlogPosts',
      through: PostCategory,
      foreignKey: 'categoryId',
      otherKey: 'postId'
    })
  }
  return PostCategory
};
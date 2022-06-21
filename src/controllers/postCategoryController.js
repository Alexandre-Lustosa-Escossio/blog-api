const addPostCategory = async (userId, categoryId) => {
  try {
    const response = await postCategoryService.addPostCategory({ userId, categoryId });
    return response;
  } catch (e) {
    throw new Error('Unexpected error');
  }
};

module.exports = {
  addPostCategory,
};
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let favorite = blogs[0];
  for (let blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog;
    }
  }
  return favorite;
};

//4.6 i 4.7 do zrobienia po zakończeniu tej części kursu

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

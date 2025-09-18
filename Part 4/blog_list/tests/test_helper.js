const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "First Blog",
    author: "Author 1",
    url: "http://example.com/1",
    likes: 5,
  },
  {
    title: "Second Blog",
    author: "Author 2",
    url: "http://example.com/2",
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    url: "http://tempurl.com",
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const notesInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  notesInDb,
};

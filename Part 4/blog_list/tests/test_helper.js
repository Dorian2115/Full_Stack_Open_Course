const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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

const createTestUser = async () => {
  const user = new User({
    username: "testuser",
    name: "Test User",
    password: "password",
  });
  await user.save();
  return user;
};

const getValidToken = async () => {
  const user = await createTestUser();
  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET
  );
  return token;
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  notesInDb,
  usersInDb,
  getValidToken,
};

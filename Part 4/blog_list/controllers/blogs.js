const blogsRouter = require("express").Router();
const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/blogs", async (request, response) => {
  const responseBlogs = await Blog.find({});
  response.json(responseBlogs);
});

blogsRouter.get("/blogs/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/blogs", async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const uploadedBlog = await blog.save();
  response.status(201).json(uploadedBlog);
});

blogsRouter.post("/users", async (request, response) => {
  const body = request.body;

  console.log(body);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: await bcrypt.hash(body.password, 10),
  });

  user.save().then((savedUser) => {
    response.status(201).json(savedUser);
  });
});

blogsRouter.get("/users", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

blogsRouter.get("/users/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/blogs/:id", async (request, response) => {
  //findByIdAndRemove is deprecated - use findByIdAndDelete instead !!!!!!!!!!!!
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/blogs/:id", async (request, response) => {
  const body = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;

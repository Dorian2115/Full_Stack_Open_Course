const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const responseBlogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(responseBlogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const uploadedBlog = await blog.save();
  user.blogs = user.blogs.concat(uploadedBlog._id);
  await user.save();

  response.status(201).json(uploadedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: "only the creator can delete a blog" });
  }

  //findByIdAndRemove is deprecated - use findByIdAndDelete instead !!!!!!!!!!!!
  await Blog.deleteOne({ _id: request.params.id });
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;

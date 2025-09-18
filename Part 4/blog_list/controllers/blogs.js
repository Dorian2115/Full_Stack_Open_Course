const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const responseBlogs = await Blog.find({});
  response.json(responseBlogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog(body);

  const uploadedBlog = await blog.save();
  response.status(201).json(uploadedBlog);
});

module.exports = blogsRouter;

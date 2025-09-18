const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { initialBlogs, notesInDb } = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when there are some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    const blogs = response.body;
    blogs.forEach((blog) => {
      assert.ok(blog.id);
    });
  });

  test.only("a valid blog can be added", async () => {
    const newBlog = {
      title: "New blog",
      author: "New author",
      url: "http://newblog.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await notesInDb();
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert.ok(titles.includes("New blog"));
  });
});

after(() => {
  mongoose.connection.close();
});

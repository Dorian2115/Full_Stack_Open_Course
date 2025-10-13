const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { initialBlogs, notesInDb } = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

describe("when there are some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

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
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
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

  test("defaults likes to 0 if missing", async () => {
    const newBlog = {
      title: "Blog without likes",
      author: "Author",
      url: "http://blogwithoutlikes.com",
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(201);
    assert.strictEqual(response.body.likes, 0);
  });

  test("blog without title and url returns status code 400", async () => {
    const newBlog = {
      author: "No title and url",
      likes: 3,
    };

    const response = await api.post("/api/blogs").send(newBlog).expect(400);
    assert.strictEqual(response.body.error, "title or url missing");
  });
});

describe("deletion of a blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await notesInDb();
    const blogToDelete = blogsAtStart[0];
    console.log(blogToDelete.id);

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await notesInDb();
    const titles = blogsAtEnd.map((r) => r.title);
    assert(!titles.includes(blogToDelete.title));
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);
  });
});

describe("updating a blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  test("succeeds in updating the likes of a blog", async () => {
    const blogsAtStart = await notesInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlogData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    const User = require("../models/user");
    await User.deleteMany({});

    const bcrypt = require("bcrypt");
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const User = require("../models/user");
    const usersAtStart = await User.find({});

    const newUser = {
      username: "test123",
      name: "Test User",
      password: "examplePassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    assert.ok(usernames.includes(newUser.username));
  });

  test("creating user with username or password length < 3 characters throws error", async () => {
    const User = require("../models/user");
    const usersAtStart = await User.find({});

    const badUser = {
      username: "te",
      name: "Test User",
      password: "12",
    };

    await api
      .post("/api/users")
      .send(badUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    const usernames = usersAtEnd.map((u) => u.username);
    assert.ok(!usernames.includes(badUser.username));
  });
});

after(() => {
  mongoose.connection.close();
});

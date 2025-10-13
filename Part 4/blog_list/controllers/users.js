const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.password || body.password.length < 3) {
    return response.status(400).json({
      error: "password is required and must be at least 3 characters long",
    });
  }

  if (!body.username || body.username.length < 3) {
    return response.status(400).json({
      error: "username is required and must be at least 3 characters long",
    });
  }

  const existingUser = await User.findOne({ username: body.username });
  if (existingUser) {
    return response.status(400).json({ error: "username must be unique" });
  }

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: await bcrypt.hash(body.password, 10),
  });

  user.save().then((savedUser) => {
    response.status(201).json(savedUser);
  });
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

usersRouter.delete("/:id", async (request, response) => {
  const user = await User.findByIdAndDelete(request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

module.exports = usersRouter;

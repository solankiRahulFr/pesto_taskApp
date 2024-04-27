const mongoose = require("mongoose");

const validateEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [5, "Must have at least 5 characters"],
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    validate: [validateEmail, "Email address invalid"],
  },
  passwordHash: {
    type: String,
    required: true,
    minLength: [6, "Must have at least 6 characters"],
  },
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id, delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

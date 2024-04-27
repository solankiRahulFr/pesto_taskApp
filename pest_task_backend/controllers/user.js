const bcrypt = require("bcrypt");
const usersRounter = require("express").Router();
const User = require("../models/users");
const saltRounds = 5;
usersRounter.post("/", async (req, res, next) => {
  console.log(req.body);
  const { email, name, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).send({ error: "Missing required fields" });

  try {
    
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, name, passwordHash });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});


usersRounter.post('/updatePassword', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
      const user = await User.findById(userId);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);

      if (!isMatch) return res.status(400).json({ message: 'Invalid old password' });
      
      user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = usersRounter;

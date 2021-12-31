import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import { HttpStatus } from "../HttpStatus.js";

dotenv.config();

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(HttpStatus.OK).json({ result: existingUser, token });
  } catch (error) {
    res
      .status(HttpStatus.SERVER_ERROR)
      .json({ message: `Server error: ${error}` });
  }
};

export const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "User already exists." });

    if (password !== confirmPassword)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Passwords don't match." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(HttpStatus.OK).json({ result, token });
  } catch (error) {
    res
      .status(HttpStatus.SERVER_ERROR)
      .json({ message: `Server error: ${error}` });
  }
};



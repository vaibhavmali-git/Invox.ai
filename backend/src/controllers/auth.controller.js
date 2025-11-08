import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/* helper: generate JWT*/
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* @desc Register New User
   @route POST /api/auth/register
   @access Public 
   */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    /* check if user exists */
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    /* create user */
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* @desc Login User
   @route POST /api/auth/login
   @access Public 
   */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),

        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* @desc Get current logged in user
   @route GET /api/auth/me
   @access Private 
   */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),

      businessName: user.businessName || "",
      address: user.address || "",
      phone: user.phone || "",
    });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* @desc Update user profile
   @route PUT /api/auth/me
   @access Private 
   */
export const updatedUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.businessName = req.body.businessName || user.businessName;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        businessName: updatedUser.businessName,
        address: updatedUser.address,
        phone: updatedUser.phone
      })
    } else{
        res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
     console.error("Update profile error:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

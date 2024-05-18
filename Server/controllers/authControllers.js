import Users from "../models/userModel.js";
import { ErrorHandler } from "../utils/error.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName) {
    return next(new ErrorHandler("First Name is Required", 400));
  }
  if (!lastName) {
    return next(new ErrorHandler("Last Name is Required", 400));
  }
  if (!email) {
    return next(new ErrorHandler("Email is Required", 400));
  }
  if (!password) {
    return next(new ErrorHandler("Password is Required", 400));
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      return next(new ErrorHandler("User Already Exists", 400));
    }

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = await user.createJWT();

    res.status(201).send({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(new ErrorHandler("Email or Password is Missing", 400));
    }
    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User Not Found", 400));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid Email or Password", 400));
    }

    user.password = undefined;
    const token = user.createJWT();

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

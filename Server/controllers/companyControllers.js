import mongoose from "mongoose";
import Company from "../models/companyModel.js";
import { ErrorHandler } from "../utils/error.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name) {
    return next(new ErrorHandler("Company Name is Required", 400));
  }
  if (!email) {
    return next(new ErrorHandler("Email Address is Required", 400));
  }
  if (!password) {
    return next(new ErrorHandler("Password is Required", 400));
  }

  try {
    const accountExist = await Company.findOne({ email });

    if (accountExist) {
      return next(new ErrorHandler("Email Address Already Exists", 400));
    }

    const company = await Company.create({
      name,
      email,
      password,
    });

    const token = company.createJWT();

    res.status(201).json({
      success: true,
      message: "Company Account Created Successfully",
      user: {
        _id: company._id,
        name: company.name,
        email: company.email,
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
      return next(new ErrorHandler("Please Provide User Credentials", 400));
    }
    const company = await Company.findOne({ email }).select("+password");
    if (!company) {
      return next(new ErrorHandler("Company Not Found", 400));
    }
    const isMatch = await company.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid Email or Password", 400));
    }
    company.password = undefined;
    const token = company.createJWT();

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: company,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  const { name, contact, location, profileUrl, about } = req.body;

  try {
    if (!name || !location || !about || !contact || !profileUrl) {
      return next(new ErrorHandler("Please Provide all Required Fields", 400));
    }
    const id = req.body.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const updateCompany = {
      name,
      contact,
      location,
      profileUrl,
      about,
      _id: id,
    };

    const company = await Company.findByIdAndUpdate(id, updateCompany, {
      new: true,
    });

    const token = company.createJWT();
    company.password = undefined;

    res.status(200).json({
      success: true,
      message: "Company Profile Updated SUccessfully",
      company,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    const id = req.body.user.userId;
    const company = await Company.findById({ _id: id });
    if (!company) {
      return next(new ErrorHandler("Company Not Found", 400));
    }
    company.password = undefined;
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;
    const queryObject = {};

    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    let queryResult = Company.find(queryObject).select("-password");

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("name");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-name");
    }

    // PADINATIONS
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // records count
    const total = await Company.countDocuments(queryResult);
    const numOfPage = Math.ceil(total / limit);
    // move next page
    // queryResult = queryResult.skip(skip).limit(limit);

    // show mopre instead of moving to next page
    queryResult = queryResult.limit(limit * page);

    const companies = await queryResult;

    res.status(200).json({
      success: true,
      total,
      data: companies,
      page,
      numOfPage,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobListing = async (req, res, next) => {
  const { search, sort } = req.query;
  const id = req.body.user.userId;

  try {
    const queryObject = {};

    if (search) {
      queryObject.location = { $regex: search, $options: "i" };
    }

    let sorting;
    if (sort === "Newest") {
      sorting = "-createdAt";
    }
    if (sort === "Oldest") {
      sorting = "createdAt";
    }
    if (sort === "A-Z") {
      sorting = "name";
    }
    if (sort === "Z-A") {
      sorting = "-name";
    }

    let queryResult = await Company.findById({ _id: id }).populate({
      path: "jobPosts",
      options: { sort: sorting },
    });
    const companies = await queryResult;

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await Company.findById({ _id: id }).populate({
      path: "jobPosts",
      options: {
        sort: "-_id",
      },
    });

    if (!company) {
      return next(new ErrorHandler("Company Not Found", 400));
    }

    company.password = undefined;

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

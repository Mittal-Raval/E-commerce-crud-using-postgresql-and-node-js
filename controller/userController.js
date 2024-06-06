import * as userService from "../services/userService.js";
import { generateToken } from "../utils/service.js";
import { handleResponse } from "../utils/service.js";
import { BadRequestError, NotFoundError } from "../error/error.js";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, role_id } = req.body;
    // console.log(req.body);

    if (isNaN(parseInt(role_id))) {
      throw new BadRequestError("Role ID must be an integer");
    }

    const existingUser = await userService.userFindOne({ username: username });

    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    await userService.createUser(username, email, password, role_id);
    return handleResponse(res, 200, "User added successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.userFindOne({ email });
    //console.log(user);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.password !== password) {
      throw new BadRequestError("Invalid Password");
    }

    const token = generateToken(
      { userId: user.id, role: user.role_id },
      process.env.SECRETKEY,
      "1h"
    );
    return handleResponse(res, 201, "User login successfully", token);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return handleResponse(res, 201, "User fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (user) {
      return handleResponse(res, 201, "User fetched successfully", user);
    } else {
      throw new NotFoundError("user not found");
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const existingUser = await userService.getUserById(id);
    if (!existingUser) {
      throw new NotFoundError("user not found");
    }

    // Check if the new email is already taken by another user
    if (updateData.email) {
      const userWithSameEmail = await userService.userFindOne({
        email: updateData.email,
      });
      if (userWithSameEmail && userWithSameEmail.id !== parseInt(id)) {
        throw new BadRequestError("Email already exists for another user");
      }
    }

    // Update the user
    const user = await userService.updateUser(id, updateData);
    return handleResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await userService.deleteUser(id);

    if (!user) {
      throw new NotFoundError("user not found");
    } else {
      return handleResponse(res, 200, "User deleted successfully");
    }
  } catch (error) {
    next(error);
  }
};

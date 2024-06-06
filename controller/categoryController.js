import * as categoryService from "../services/categoryServices.js";
import {
  handleResponse,
  paginatedResponse,
  paginationAndSorting,
  searching,
} from "../utils/service.js";
import { BadRequestError, NotFoundError } from "../error/error.js";

export const createCategoryData = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    const existingCategory = await categoryService.checkCategoryExists(
      categoryName
    );

    if (existingCategory) {
      throw new BadRequestError("Category already exists");
    }

    await categoryService.createCategory(categoryName);

    // Check the role of the user who hit the API
    if (req.user.role === "admin") {
      console.log("API hit by Admin");
    } else if (req.user.role === "user") {
      console.log("API hit by User");
    }

    return handleResponse(res, 200, "Category added successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const pgAndSort = req.query;
    const searchFilter = req.query.searchFilter || "";
    const fields = ["categoryName"];

    const Sorting = paginationAndSorting(pgAndSort);
    const { page, perPage } = Sorting;

    const Searching = await searching(searchFilter, fields);

    const list = await categoryService.getAllCategories(Sorting, Searching);
    const totalRecords = await categoryService.totalCategory(Searching);
    const totalCount = await paginatedResponse(
      page,
      perPage,
      totalRecords,
      list
    );

    const data = totalCount;
    return handleResponse(res, 200, "Categories listed successfully", data);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return handleResponse(res, 200, "Category listed successfully", category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;
    const existingCategory = await categoryService.checkCategoryExists(
      categoryName
    );

    if (existingCategory) {
      throw new BadRequestError("Category already exists");
    }

    const category = await categoryService.updateCategory(id, categoryName);

    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return handleResponse(res, 200, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryDeleted = await categoryService.deleteCategory(id);
    if (!categoryDeleted) {
      throw new NotFoundError("Category not found");
    }

    return handleResponse(res, 200, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

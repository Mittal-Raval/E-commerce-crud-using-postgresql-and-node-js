import * as productService from "../services/productService.js";
import {
  paginationAndSorting,
  searching,
  paginatedResponse,
  handleResponse,
} from "../utils/service.js";
import { BadRequestError, NotFoundError } from "../error/error.js";
import fs from "fs/promises";
import path from "path";

export const createProductData = async (req, res, next) => {
  try {
    const files = req.files ? req.files.images : null;
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new BadRequestError("No images uploaded");
    }

    const { productName, description, price, quantity, categoryId } = req.body;

    const existingProduct = await productService.productFindOne({
      productName,
    });

    if (existingProduct) {
      throw new BadRequestError("Product already exists");
    }

    const categories = Array.isArray(categoryId) ? categoryId : [categoryId];

    const existingCategories = await productService.findCategoriesByIds(
      categories
    );

    if (existingCategories.length !== categories.length) {
      throw new BadRequestError("categories not exist");
    }

    const productData = {
      productName,
      description,
      price,
      quantity,
    };

    const product = await productService.createProduct(productData);

    const imageUrls = [];
    if (Array.isArray(files)) {
      // Create a new folder with the product ID
      const productFolder = path.join("uploads", `product_${product.id}`);
      await fs.mkdir(productFolder, { recursive: true });

      for (const file of files) {
        const uploadPath = path.join(
          productFolder,
          `${Date.now()}_${file.name}`
        );
        await file.mv(uploadPath);
        imageUrls.push(uploadPath);
      }
    } else {
      // Create a new folder with the product ID
      const productFolder = path.join("uploads", `product_${product.id}`);
      await fs.mkdir(productFolder, { recursive: true });

      const uploadPath = path.join(productFolder, files.name);
      await files.mv(uploadPath);
      imageUrls.push(uploadPath);
    }

    await productService.saveImageUrls(product.id, imageUrls);

    await productService.createProductCategoryRelations(product.id, categories);

    return handleResponse(res, 200, "Product added successfully");
  } catch (error) {
    next(error);
  }
};





export const addToCart = async(req, res, next) => {
  try {
    const {productId, quantity} = req.body;
  const userId = req.user.id;

  const product = await productService.getProductById(productId);
  if(!product){
    throw new NotFoundError("product not found");
  }

const cartItem = await productService.addToCart(userId, productId, quantity);

return handleResponse(res, 200, "Product added to cart successfully", cartItem);
  
  } catch (error) {
      next(error);    
  }
  
}



export const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await productService.getProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return handleResponse(res, 200, "Product listed successfully", product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { productName, description, price, quantity, categoryId } = req.body;
    const files = req.files ? req.files.images : null;

    const existingProduct = await productService.getProductById(id);

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    if (productName) {
      const productWithSameName = await productService.productFindOne({
        productName,
      });

      if (productWithSameName && productWithSameName.id !== parseInt(id)) {
        throw new BadRequestError("Product name already exists");
      }
    }

    const productData = { productName, description, price, quantity };

    const updatedProduct = await productService.updateProduct(id, productData);

    if (!updatedProduct) {
      throw new NotFoundError("Product not found");
    }

    // Delete existing images from the upload folder and database

    if (req.files) {
      const existingImageUrls = await productService.getImageUrls(id);
      const productFolder = path.join(
        "uploads",
        `product_${updatedProduct.id}`
      );
      for (const { imageurl } of existingImageUrls) {
        try {
          const imagePath = path.join(productFolder, path.basename(imageurl)); // Adjust the path as needed
          console.log("Deleting image:", imagePath);
          await fs.unlink(imagePath);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
      await productService.deleteProductImages(id);
    }

    // Upload new images
    if (files && (Array.isArray(files) ? files.length > 0 : true)) {
      const imageUrls = [];
      const productFolder = path.join(
        "uploads",
        `product_${updatedProduct.id}`
      );
      if (Array.isArray(files)) {
        for (const file of files) {
          const uploadPath = path.join(
            productFolder,
            `${Date.now()}_${file.name}`
          );
          await file.mv(uploadPath);
          imageUrls.push(uploadPath);
        }
      } else {
        const uploadPath = path.join("uploads", `${Date.now()}_${files.name}`);
        await files.mv(uploadPath);
        imageUrls.push(uploadPath);
      }
      await productService.saveImageUrls(id, imageUrls);
    }

    // Update product-category relations
    if (categoryId) {
      await productService.deleteProductCategoryRelations(id);
      const categories = Array.isArray(categoryId) ? categoryId : [categoryId];
      const existingCategories = await productService.findCategoriesByIds(
        categories
      );
      if (existingCategories.length !== categories.length) {
        throw new BadRequestError("Some categories do not exist");
      }
      await productService.createProductCategoryRelations(id, categories);
    }

    return handleResponse(
      res,
      200,
      "Product updated successfully",
      updatedProduct
    );
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await productService.getProductById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Get the folder path
    const productFolder = path.join("uploads", `product_${id}`);

    // Delete the product from the database
    const deletedProduct = await productService.deleteProduct(id);

    if (!deletedProduct) {
      throw new NotFoundError("Product not found");
    }

    // Delete the product folder
    try {
      await fs.rm(productFolder, { recursive: true });
      console.log(`Deleted folder: ${productFolder}`);
    } catch (error) {
      console.error("Error deleting folder:", error);
    }

    return handleResponse(res, 200, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const pgAndSort = req.query;
    const searchFilter = req.query.searchFilter || "";
    const fields = ["productName", "description", "categoryName"];

    const Sorting = paginationAndSorting(pgAndSort);
    const { page, limit } = Sorting;

    const Searching = await searching(searchFilter, fields);
    const list = await productService.getAllProducts(Sorting, Searching);

    const totalRecords = await productService.totalRecordResponse(Searching);
    const totalCount = await paginatedResponse(page, limit, totalRecords, list);
    const data = totalCount;
    return handleResponse(res, 200, "Products listed successfully", data);
  } catch (error) {
    next(error);
  }
};

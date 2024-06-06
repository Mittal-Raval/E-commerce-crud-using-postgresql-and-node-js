import pool from "../config/dbConnection.js";

export const productFindOne = async (filter) => {
  const query = "SELECT * FROM product WHERE productName = $1";
  const values = [filter.productName];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const createProduct = async (productData) => {
  const { productName, description, price, quantity } = productData;
  const query = `
    INSERT INTO product (productName, description, price, quantity)
    VALUES ($1, $2, $3, $4) RETURNING *
  `;
  const values = [productName, description, price, quantity];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const saveImageUrls = async (productId, imageUrls) => {
  const query = `
    INSERT INTO productimages (productId, imageUrl)
    VALUES ($1, unnest($2::text[]))
  `;
  const values = [productId, imageUrls];
  await pool.query(query, values);
};

export const createProductCategoryRelations = async (productId, categories) => {
  const query = `
    INSERT INTO productcategoryrelations (productId, categoryId)
    VALUES ($1, unnest($2::int[]))
  `;
  const values = [productId, categories];
  await pool.query(query, values);
};

export const getProductById = async (id) => {
  const query = `SELECT * FROM product WHERE id = $1`;
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateProduct = async (id, productData) => {
  const { productName, description, price, quantity } = productData;
  const query = `
    UPDATE product 
    SET productName = COALESCE($1, productName),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        quantity = COALESCE($4, quantity)
    WHERE id = $5 RETURNING *;
  `;
  const values = [productName, description, price, quantity, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteProduct = async (id) => {
  const query = "DELETE FROM product WHERE id = $1 RETURNING *";
  const values = [id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllProducts = async (Sorting, Searching) => {
  const { limit, offset, sortField, sortOrder } = Sorting;
  const { searchQuery, searchValues, searchConditions } = Searching;

  const query = `
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'categoryId', c.id,
            'categoryName', c.categoryName
          )
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'
      ) AS categories,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'imageId', pi.id,
            'imageUrl', CONCAT('http://localhost:3000/', pi.imageUrl)
          )
        ) FILTER (WHERE pi.id IS NOT NULL), 
        '[]'
      ) AS imagesUrl
    FROM product p
    LEFT JOIN productcategoryrelations pc ON p.id = pc.productId
    LEFT JOIN category c ON pc.categoryId = c.id
    LEFT JOIN productimages pi ON p.id = pi.productId
    WHERE ${searchQuery ? searchConditions : "1=1"}
    GROUP BY p.id
    ORDER BY ${sortField} ${sortOrder}
    LIMIT $${searchValues.length + 1} OFFSET $${searchValues.length + 2}
  `;

  const values = [...searchValues, limit, offset];
  const { rows } = await pool.query(query, values);
  if (rows.length === 0) {
    return [];
  }

  return rows;
};

export const totalRecordResponse = async (Searching) => {
  const { searchQuery, searchValues, searchConditions } = Searching;

  const query = `
    SELECT COUNT(DISTINCT p.id) AS total_count
    FROM product p
    LEFT JOIN productcategoryrelations pc ON p.id = pc.productId
    LEFT JOIN category c ON pc.categoryId = c.id
    WHERE ${searchQuery ? searchConditions : "1=1"}
  `;

  const { rows } = await pool.query(query, searchValues);
  return parseInt(rows[0].total_count, 10);
};

export const findCategoriesByIds = async (categoryIds) => {
  const query = `
    SELECT id
    FROM category
    WHERE id = ANY($1::int[])
  `;
  const values = [categoryIds];
  const { rows } = await pool.query(query, values);
  return rows.map((row) => row.id);
};

export const getImageUrls = async (productId) => {
  const query = `SELECT imageurl FROM productimages WHERE productId = $1`;
  const values = [productId];
  const { rows } = await pool.query(query, values);
  return rows;
  // return rows.map(row => row.imageUrl);
};

export const deleteProductImages = async (productId) => {
  const query = "DELETE FROM productimages WHERE productId = $1";
  const values = [productId];
  await pool.query(query, values);
};

export const getCategoriesByIds = async (productId) => {
  const query = `
    SELECT categoryId FROM productcategoryrelations WHERE productId = $1
  `;
  const values = [productId];
  const { rows } = await pool.query(query, values);
  return rows.map((row) => row.categoryId);
};

export const deleteProductCategoryRelations = async (productId) => {
  const query = "DELETE FROM productcategoryrelations WHERE productId = $1";
  const values = [productId];
  await pool.query(query, values);
};

export const addToCart = async (userId, productId, quantity) => {
  const query = `INSERT INTO carts (user_id, product_id, quantity)
                  VALUES ($1, $2, $3) RETURNING * `;
  const values = [userId, productId, quantity];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

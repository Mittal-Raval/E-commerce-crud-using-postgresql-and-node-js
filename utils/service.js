import jwt from "jsonwebtoken";

export const paginationAndSorting = (pgAndSort) => {
  const page = parseInt(pgAndSort.page) || 1;
  const limit = parseInt(pgAndSort.limit) || 10;
  const sortField = pgAndSort.sortField || "id";
  const sortOrder = pgAndSort.sortOrder || "ASC";

  const offset = (page - 1) * limit;

  return { limit, offset, sortField, sortOrder, page};
};

export const searching = async (searchFilter, fields) => {
  const searchQuery = searchFilter || " ";
  const searchValues = searchQuery ? fields.map(() => `%${searchQuery}%`) : [];
  const searchConditions = searchQuery
    ? fields.map((field, index) => `${field} ILIKE $${index + 1}`).join(" OR ")
    : "";

  return {
    searchQuery,
    searchValues,
    searchConditions,
  };
};

// export const paginatedResponse = async (page, perPage, totalRecords, list) => {
//   const totalPages = Math.ceil(totalRecords / perPage);
//   if (page > totalPages) {
//     throw new NotFoundError("Page not found");
//   }
//   let limit = perPage;
//   return { list, page, limit, totalRecords, totalPages };
// };


export const paginatedResponse = async (page, perPage, totalRecords, list) => {
  const totalPages = Math.ceil(totalRecords / perPage);
  let limit = perPage;

  if (page > totalPages) {
    return { list: []};
  }

  return { list, page, limit, totalRecords, totalPages };
};



export const generateToken = (payload, secretKey, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

export const handleResponse = async (res, statusCode, message, data) => {
  if (res.headersSent) {
    return;
  }

  if (statusCode >= 300) {
    return res.status(statusCode).json({ success: false, message });
  }

  if (!data) {
    return res.status(statusCode).json({ success: true, message });
  }

  return res.status(statusCode).json({ success: true, message, data });
};

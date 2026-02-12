import httpClient from "./httpClient";

/* ================= AUTH ================= */

export const loginApi = (email, password) =>
  httpClient.post("admin/login", {
    email: email.toLowerCase(),
    password,
  });

export const getProfileApi = () =>
  httpClient.get("admin/profile");

export const updateProfileApi = (data) =>
  httpClient.put("admin/update-profile", data);


/* ================= CATEGORY ================= */

export const getCategoriesApi = () =>
  httpClient.get("categories/get-categories");

export const addCategoryApi = (data) =>
  httpClient.post("categories/add-category", data);

export const updateCategoryApi = (id, data) =>
  httpClient.put(`categories/update-category/${id}`, data);

export const deleteCategoryApi = (id) =>
  httpClient.delete(`categories/delete-category/${id}`);


/* ================= TERMS ================= */

export const getTermsApi = () =>
  httpClient.get("legal/terms-and-conditions");

export const createTermsApi = (data) =>
  httpClient.post("legal/terms-and-conditions", data);

export const updateTermsApi = (id, data) =>
  httpClient.put(`legal/terms-and-conditions/${id}`, data);


/* ================= PRIVACY ================= */

export const getPrivacyApi = () =>
  httpClient.get("legal/privacy-policy");

export const createPrivacyApi = (data) =>
  httpClient.post("legal/privacy-policy", data);

export const updatePrivacyApi = (id, data) =>
  httpClient.put(`legal/privacy-policy/${id}`, data);


/* ================= FAQ ================= */

export const getFaqsApi = () =>
  httpClient.get("faq");

export const createFaqApi = (data) =>
  httpClient.post("faq", data);

export const updateFaqApi = (id, data) =>
  httpClient.put(`faq/${id}`, data);

export const deleteFaqApi = (id) =>
  httpClient.delete(`faq/${id}`);

/* ================= Image api ================= */
export const ImageUrlApi = (data) =>
  httpClient.post("stories/upload-thumbnail", data);
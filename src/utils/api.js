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
  httpClient.get("faq/get-faqs");

export const createFaqApi = (data) =>
  httpClient.post("faq/create-faq", data);

export const updateFaqApi = (id, data) =>
  httpClient.put(`faq/get-faqs/${id}`, data);

export const deleteFaqApi = (id) =>
  httpClient.delete(`faq/get-faqs/${id}`);

/* ================= Image api ================= */
export const ImageUrlApi = (data) =>
  httpClient.post("stories/upload-thumbnail", data);


/* ================= Support ================= */
export const getHelpApi = () =>
  httpClient.get("support/help");

export const getFeedbackApi = () =>
  httpClient.get("support/feedback");

/* ================= Intrest/Filter ================= */
export const createFilterApi = (data) =>
  httpClient.post("filters/create-filter", data);

export const getFilterApi = () =>
  httpClient.get("filters/get-filter");

export const updateFilterApi = (id, data) =>
  httpClient.put(`filters/update-filter/${id}`, data);

export const deleteFilterApi = (id) =>
  httpClient.delete(`faq/delete-faqs/${id}`);


/* ================= Episode/Story ================= */
export const createEpisodeApi = (data) =>
  httpClient.post("stories/create-story", data);

export const getEpisodeApi = () =>
  httpClient.get("stories/get-story/");

export const getEpisodeApiID = (id) =>
  httpClient.get(`stories/${id}`);

export const updateEpisodeApi = (id, data) =>
  httpClient.put(`stories/update-story${id}`, data);

export const deleteEpisodeApi = (id) =>
  httpClient.delete(`stories/delete-story/${id}`);

/* ================= Quiz ================= */

export const createQuizApi = (data) =>
  httpClient.post("story-questions/create", data);

export const getQuizApiID = (id) =>
  httpClient.get(`story-questions/${id}`);

export const updateQuizApi = (id, data) =>
  httpClient.put(`story-questions/${id}`, data);

export const deleteQuizApi = (id) =>
  httpClient.delete(`story-questions/${id}`);
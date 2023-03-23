import fetch from "cross-fetch";
/**
 *
 * @param {string} url
 * @param {Parameters<typeof fetch>[1]} options
 * @returns {Promise<unknown>} Json
 */
const request = async (url, options = {}) => {
  try {
    const fullUrl = `${import.meta.env.VITE_BASE_URL}${url}`;
    const response = await fetch(fullUrl, options);

    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error("API 통신 실패");
  } catch (e) {
    alert(e.message);
  }
};

export default request;

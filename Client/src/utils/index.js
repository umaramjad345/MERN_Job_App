import axios from "axios";
const API_URL = "http://localhost:4000/api/v1";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  console.log();
  try {
    const result = await API({
      url,
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (error) {
    const err = error?.response?.data;
    return { status: err?.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFIle) => {
  const formData = new FormData();
  formData.append("file", uploadFIle);
  formData.append("upload_preset", "JobNest");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/duanycbve/image/upload/",
      formData
    );
    return res?.data.secure_url;
  } catch (error) {
    console.log(error?.response?.data?.message);
  }
};

export const updateURL = ({
  pageNum,
  query,
  cmpLoc,
  sort,
  jType,
  exp,
  navigate,
  location,
}) => {
  const params = new URLSearchParams();
  if (pageNum && pageNum > 1) {
    params.set("page", pageNum);
  }
  if (query) {
    params.set("search", query);
  }
  if (cmpLoc) {
    params.set("location", cmpLoc);
  }
  if (sort) {
    params.set("sort", sort);
  }
  if (jType) {
    params.set("jType", jType);
  }
  if (exp) {
    params.set("exp", exp);
  }
  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};

import axios from "axios";

const api = axios.create({
  baseURL: "https://n8n-acc-production-4528.up.railway.app",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// دالة خاصة برفع ملف الأكسيل لمعالجة الفروع
export const uploadExcelFile = async (file: File) => {
  const formData = new FormData();
  formData.append("excel", file);

  const response = await api.post(
    "/webhook/4fb8bbaf-d7ff-48a6-9549-e824c194823b",
    formData
  );

  return response.data;
};

export default api;

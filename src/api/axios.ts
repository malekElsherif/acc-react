import axios from "axios";

const api = axios.create({
  baseURL: "https://n8n-acc-production-4528.up.railway.app",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// 1. دالة رفع ملف الإكسيل ومعالجة البيانات لعرضها في الواجهة (تم إضافة voucherDate هنا)
export const uploadExcelFile = async (file: File, voucherDate: string) => {
  const formData = new FormData();
  formData.append("excel", file);
  formData.append("voucherDate", voucherDate); // إرسال التاريخ المحدد من الواجهة

  const response = await api.post(
    "/webhook/4fb8bbaf-d7ff-48a6-9549-e824c194823b",
    formData
  );

  // التعامل مع مصفوفة n8n واستخراج الكائن الرئيسي
  const resData = Array.isArray(response.data) ? response.data[0] : response.data;

  console.log({
    tableData: resData.tableData || [],
    excelFile: resData.excelFile || null,
    total_records: resData.total_records || 0
  });

  return {
    tableData: resData.tableData || [],
    excelFile: resData.excelFile || null,
    total_records: resData.total_records || 0
  };
};

// 2. دالة لتحميل ملف الإكسيل مباشرة عند الضغط على زر التحميل
export const downloadExcelFile = (excelFileObj) => {
  if (!excelFileObj || !excelFileObj.base64) {
    console.error("ملف الإكسيل غير متوفر");
    return;
  }

  const byteCharacters = atob(excelFileObj.base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: excelFileObj.mimeType });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = excelFileObj.fileName || 'مشتريات.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default api;

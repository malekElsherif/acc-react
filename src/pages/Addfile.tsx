import React, { useState } from "react";
import { uploadExcelFile } from "../api/axios";

// قائمة البنود التي تندرج تحت "المشتريات" وفقاً للجدول المرفق
const PURCHASE_CATEGORIES = new Set([
  "اسماك",
  "البان",
  "ألبان",
  "بقالة",
  "بقاله",
  "خضروات",
  "دواجن",
  "عصائر",
  "لحوم",
  "مخبوزات",
  "مستلزمات",
  "مياه",
  "مياده",
  "صودا",
  "تعبئة وتغليف",
  "تعبئة وتغليف ",
  "مقبلات"
]);

interface AggregatedItem {
  details: string;
  quantity: number;
  amount_before_tax: number;
  tax_amount: number;
  amount_after_tax: number;
}

interface Branch {
  branch_name: string;
  total_transactions?: number;
  branch_total_before_tax?: number;
  branch_total_tax?: number;
  branch_total_after_tax?: number;
  items?: AggregatedItem[];
}

interface SupplierData {
  supplier_name: string;
  total_amount_before_tax?: number;
  total_tax_amount?: number;
  total_amount_after_tax?: number;
  branches: Branch[];
}

const Addfile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [suppliersData, setSuppliersData] = useState<SupplierData[]>([]);
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("برجاء اختيار ملف أكسيل أولاً");
      return;
    }

    setLoading(true);
    setResponseMessage("");

    try {
      const data = await uploadExcelFile(file);
      setSuppliersData(data);
      setSelectedSupplierIndex(0);
      setResponseMessage("تم رفع الملف ومعالجة البيانات بنجاح!");
    } catch (error: any) {
      console.error(error);
      setResponseMessage(
        error.response?.data?.message || "فشل في رفع الملف، تحقق من السيرفر."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentSupplier = suppliersData[selectedSupplierIndex];
  const currentDate = new Date().toLocaleDateString("en-GB");

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto", direction: "rtl", fontFamily: "sans-serif" }}>
      {/* CSS الخاص بتصغير حجم الفاتورة في الطباعة */}
      <style>{`
        @media print {
          .no-print, form, nav, button {
            display: none !important;
          }
          body {
            background: #fff !important;
            direction: rtl !important;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .screen-view {
            display: none !important;
          }
          .voucher-page {
            display: block !important;
            page-break-after: always !important;
            break-after: page !important;
            break-inside: avoid !important;
            /* تصغير العرض والمسافات لتلائم حجم الفاتورة القصير */
            max-width: 650px !important;
            margin: 0 auto 20px auto !important;
            padding: 10px 15px !important;
            box-sizing: border-box;
          }

          .voucher-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            direction: rtl;
            margin-bottom: 10px;
            font-size: 13px;
            font-weight: bold;
            color: #000;
          }

          .voucher-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px; /* تصغير حجم الخط داخل الجدول */
            direction: rtl;
            table-layout: fixed;
          }
          .voucher-table th, .voucher-table td {
            border: 1px solid #000 !important;
            padding: 3px 6px; /* تصغير حواف الخلايا لتقليل الارتفاع */
            height: 20px;     /* تقليل ارتفاع السطر */
            vertical-align: middle;
            word-wrap: break-word;
          }
          .voucher-table th {
            font-weight: bold;
            text-align: center;
            color: #444;
            background-color: #fff;
          }
          .th-title-ar {
            display: block;
            font-size: 10px;
            color: #666;
            margin-top: 1px;
          }
          .txt-right {
            text-align: right !important;
            padding-right: 8px !important;
          }
          .txt-center {
            text-align: center !important;
          }
          .bold-text {
            font-weight: bold !important;
          }
        }

        @media screen {
          .voucher-page {
            display: none;
          }
        }
      `}</style>

      {/* منطقة التحكم والرفع */}
      <div className="no-print">
        <h2>رفع ملف الموردين (Excel)</h2>

        <form onSubmit={handleSubmit} style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "جاري المعالجة..." : "رفع ومعالجة الملف"}
          </button>
        </form>

        {responseMessage && (
          <p style={{ marginTop: "15px", fontWeight: "bold", color: responseMessage.includes("نجاح") ? "green" : "red" }}>
            {responseMessage}
          </p>
        )}
      </div>

      {suppliersData.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          {/* اختيار المورد */}
          <div className="no-print" style={{ display: "flex", gap: "10px", overflowX: "auto", borderBottom: "2px solid #dee2e6", paddingBottom: "8px", marginBottom: "20px" }}>
            {suppliersData.map((sup, index) => (
              <button
                key={index}
                onClick={() => setSelectedSupplierIndex(index)}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: selectedSupplierIndex === index ? "bold" : "normal",
                  backgroundColor: selectedSupplierIndex === index ? "#007bff" : "#e9ecef",
                  color: selectedSupplierIndex === index ? "#fff" : "#495057",
                }}
              >
                🚚 {sup.supplier_name}
              </button>
            ))}
          </div>

          {currentSupplier && (
            <div>
              {/* عرض النظام على الشاشة */}
              <div className="screen-view">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3>بيانات المورد: {currentSupplier.supplier_name}</h3>
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    🖨️ طباعة إيصالات الفروع
                  </button>
                </div>

                {currentSupplier.branches?.map((b, i) => (
                  <div key={i} style={{ border: "1px solid #ccc", padding: "12px", borderRadius: "6px", marginBottom: "10px", background: "#fff" }}>
                    <strong>🏢 فرع: {b.branch_name}</strong> - صافي المشتريات والتشغيل: {b.branch_total_before_tax?.toLocaleString()} | الضريبة: {b.branch_total_tax?.toLocaleString()} | الإجمالي: {b.branch_total_after_tax?.toLocaleString()}
                  </div>
                ))}
              </div>

              {/* ======================================================================= */}
              {/* نموذج الفاتورة المدمجة (حجم مدمج ومناسب للإيصالات) */}
              {/* ======================================================================= */}
              {currentSupplier.branches?.map((branch, bIdx) => {
                const itemsList = branch.items || [];

                const purchaseItems: AggregatedItem[] = [];
                const operatingItems: AggregatedItem[] = [];

                itemsList.forEach((item) => {
                  const cleanedName = item.details.trim();
                  if (PURCHASE_CATEGORIES.has(cleanedName)) {
                    purchaseItems.push(item);
                  } else {
                    operatingItems.push(item);
                  }
                });

                const totalPurchasesAmount = purchaseItems.reduce((acc, item) => acc + item.amount_before_tax, 0);
                const totalOperatingAmount = operatingItems.reduce((acc, item) => acc + item.amount_before_tax, 0);

                const branchTax = branch.branch_total_tax ?? itemsList.reduce((acc, item) => acc + item.tax_amount, 0);
                const branchAfterTax = branch.branch_total_after_tax ?? itemsList.reduce((acc, item) => acc + item.amount_after_tax, 0);

                return (
                  <div key={bIdx} className="voucher-page">
                    {/* الهيدر العلوي */}
                    <div className="voucher-top-bar">
                      <div>المورد : {currentSupplier.supplier_name} - {branch.branch_name}</div>
                      <div>( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ) : No</div>
                      <div>Date : {currentDate}</div>
                    </div>

                    {/* الجدول المحاسبي */}
                    <table className="voucher-table">
                      <thead>
                        <tr>
                          <th style={{ width: "18%" }}>
                            Debit
                            <span className="th-title-ar">مدين</span>
                          </th>
                          <th style={{ width: "18%" }}>
                            Credit
                            <span className="th-title-ar">دائن</span>
                          </th>
                          <th style={{ width: "18%" }}>
                            Analysis
                            <span className="th-title-ar">البيان</span>
                          </th>
                          <th style={{ width: "46%" }}>
                            Dis
                            <span className="th-title-ar">الوصف المحاسبي</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 1. حـ / مذكورين */}
                        <tr>
                          <td></td>
                          <td></td>
                          <td className="txt-center bold-text">3</td>
                          <td className="txt-right bold-text">حـ / مذكورين</td>
                        </tr>

                        {/* 2. قسم حـ / المشتريات */}
                        {purchaseItems.length > 0 && (
                          <>
                            <tr>
                              <td className="txt-center bold-text">
                                {totalPurchasesAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td></td>
                              <td className="txt-center">..</td>
                              <td className="txt-right bold-text">حـ / المشتريات</td>
                            </tr>
                            {purchaseItems.map((item, idx) => (
                              <tr key={`p-${idx}`}>
                                <td></td>
                                <td></td>
                                <td className="txt-center">
                                  {item.amount_before_tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="txt-right">{item.details}</td>
                              </tr>
                            ))}
                          </>
                        )}

                        {/* 3. قسم حـ / م. تشغيل */}
                        {operatingItems.length > 0 && (
                          <>
                            <tr>
                              <td className="txt-center bold-text">
                                {totalOperatingAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td></td>
                              <td className="txt-center">.</td>
                              <td className="txt-right bold-text">حـ/م. تشغيل</td>
                            </tr>
                            {operatingItems.map((item, idx) => (
                              <tr key={`o-${idx}`}>
                                <td></td>
                                <td></td>
                                <td className="txt-center">
                                  {item.amount_before_tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="txt-right">{item.details}</td>
                              </tr>
                            ))}
                          </>
                        )}

                        {/* 4. حـ / الضريبه */}
                        <tr>
                          <td className="txt-center bold-text">
                            {branchTax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td></td>
                          <td className="txt-center">.</td>
                          <td className="txt-right bold-text">حـ / الضريبه</td>
                        </tr>

                        {/* Vat */}
                        <tr>
                          <td></td>
                          <td></td>
                          <td className="txt-center">.</td>
                          <td className="txt-right">Vat</td>
                        </tr>

                        {/* أسطر محاذاة فارغة */}
                        <tr><td></td><td></td><td className="txt-center">.</td><td></td></tr>
                        <tr><td></td><td></td><td className="txt-center">.</td><td></td></tr>

                        {/* 5. حـ / العهده الإدارة */}
                        <tr>
                          <td></td>
                          <td className="txt-center bold-text">
                            {branchAfterTax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="txt-center">.</td>
                          <td className="txt-right bold-text">حـ / العهده الإدارة</td>
                        </tr>

                        {/* سطر محاذاة فارغ */}
                        <tr><td></td><td></td><td className="txt-center">.</td><td></td></tr>

                        {/* 6. المجموع الكلي */}
                        <tr>
                          <td className="txt-center bold-text">
                            {branchAfterTax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="txt-center bold-text">
                            {branchAfterTax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="txt-center">.</td>
                          <td className="txt-right bold-text">المجموع الكلي</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Addfile;

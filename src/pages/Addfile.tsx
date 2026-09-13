import React, { useState, useMemo } from "react";
import axios from "axios";
import { uploadExcelFile } from "../api/axios";

// قائمة البنود القياسية بعد التنظيف (بدون همزات وبدون مسافات زائدة)
const PURCHASE_CATEGORIES = new Set([
  "اسماك",
  "البان",
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
  "مقبلات",
]);

const normalizeText = (text: string): string => {
  if (!text) return "";
  return text.trim().replace(/[أإآ]/g, "ا").replace(/\s+/g, " ");
};

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

const styles = {
  card: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    marginBottom: 16,
    background: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    overflow: "hidden" as const,
  },
  th: { padding: "10px 14px", border: "1px solid #cbd5e1" },
  td: { padding: "10px 14px", border: "1px solid #e2e8f0" },
};

const formatCurrency = (val?: number) =>
  (val ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const calculateTaxPercentage = (beforeTax?: number, tax?: number): string => {
  if (!beforeTax || beforeTax === 0 || !tax) return "0%";
  const percentage = (tax / beforeTax) * 100;
  return `${Number(percentage.toFixed(1))}%`;
};

const BranchCard: React.FC<{
  branch: Branch;
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm: string;
}> = ({ branch, isExpanded, onToggle, searchTerm }) => {
  const filteredItems = useMemo(() => {
    if (!branch.items) return [];
    if (!searchTerm.trim()) return branch.items;
    return branch.items.filter((item) =>
      item.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [branch.items, searchTerm]);

  return (
    <div style={styles.card}>
      <div
        onClick={onToggle}
        style={{
          padding: 18,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isExpanded ? "#f8fafc" : "#fff",
          transition: "background-color 0.2s",
        }}
      >
        <div>
          <strong style={{ color: "#0f172a", fontSize: 16 }}>🏢 فرع: {branch.branch_name}</strong>
          <div style={{ marginTop: 6, color: "#475569", fontSize: 14 }}>
            عدد العمليات: <b>{branch.total_transactions ?? branch.items?.length ?? 0}</b> | صافي المشتريات:{" "}
            <b>{formatCurrency(branch.branch_total_before_tax)}</b> | الضريبة:{" "}
            <b>{formatCurrency(branch.branch_total_tax)}</b> | الإجمالي:{" "}
            <b>{formatCurrency(branch.branch_total_after_tax)}</b>
          </div>
        </div>
        <div style={{ fontSize: 16, color: "#64748b", fontWeight: "bold" }}>{isExpanded ? "▲" : "▼"}</div>
      </div>

      {isExpanded && (
        <div style={{ padding: 18, borderTop: "1px solid #e2e8f0", background: "#fff" }}>
          {filteredItems.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "right" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f1f5f9", color: "#334155" }}>
                    {[
                      "#",
                      "البيان / الصنف",
                      "النوع",
                      "الكمية",
                      "المبلغ قبل الضريبة",
                      "الضريبة",
                      "نسبة الضريبة",
                      "المبلغ بعد الضريبة",
                    ].map((h) => (
                      <th key={h} style={styles.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => {
                    const isPurchase = PURCHASE_CATEGORIES.has(normalizeText(item.details));
                    const taxPercentage = calculateTaxPercentage(item.amount_before_tax, item.tax_amount);
                    return (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                        <td style={styles.td}>{idx + 1}</td>
                        <td style={{ ...styles.td, fontWeight: 600 }}>{item.details}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: "bold",
                              backgroundColor: isPurchase ? "#dcfce7" : "#feefc3",
                              color: isPurchase ? "#15803d" : "#b45309",
                            }}
                          >
                            {isPurchase ? "مشتريات" : "مصروف تشغيل"}
                          </span>
                        </td>
                        <td style={styles.td}>{item.quantity}</td>
                        <td style={styles.td}>{formatCurrency(item.amount_before_tax)}</td>
                        <td style={styles.td}>{formatCurrency(item.tax_amount)}</td>
                        <td style={{ ...styles.td, fontWeight: 600, color: "#0284c7" }}>{taxPercentage}</td>
                        <td style={styles.td}>{formatCurrency(item.amount_after_tax)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "15px 0" }}>
              لا توجد بنود مطابقة للبحث داخل هذا الفرع.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Addfile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [suppliersData, setSuppliersData] = useState<SupplierData[]>([]);
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [expandedBranches, setExpandedBranches] = useState<Record<number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [voucherDate, setVoucherDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // حساب ترتيب الموردين بناءً على الإجمالي بعد الضريبة تنازلياً
  const rankedSuppliers = useMemo(() => {
    if (!suppliersData.length) return [];

    const computed = suppliersData.map((sup, idx) => {
      const totalBefore = sup.total_amount_before_tax ?? sup.branches?.reduce((acc, b) => acc + (b.branch_total_before_tax ?? 0), 0) ?? 0;
      const totalTax = sup.total_tax_amount ?? sup.branches?.reduce((acc, b) => acc + (b.branch_total_tax ?? 0), 0) ?? 0;
      const totalAfter = sup.total_amount_after_tax ?? sup.branches?.reduce((acc, b) => acc + (b.branch_total_after_tax ?? 0), 0) ?? 0;
      const totalTx = sup.branches?.reduce((acc, b) => acc + (b.total_transactions ?? b.items?.length ?? 0), 0) ?? 0;

      return {
        originalIndex: idx,
        supplier_name: sup.supplier_name,
        totalBefore,
        totalTax,
        totalAfter,
        totalTx,
      };
    });

    computed.sort((a, b) => b.totalAfter - a.totalAfter);
    return computed;
  }, [suppliersData]);

  const currentSupplierRankInfo = useMemo(() => {
    if (!suppliersData.length) return { rank: 0, totalCount: 0, data: null };
    const currentSupName = suppliersData[selectedSupplierIndex]?.supplier_name;
    const rankIndex = rankedSuppliers.findIndex((s) => s.supplier_name === currentSupName);

    return {
      rank: rankIndex !== -1 ? rankIndex + 1 : 1,
      totalCount: rankedSuppliers.length,
      data: rankedSuppliers.find((s) => s.supplier_name === currentSupName),
    };
  }, [rankedSuppliers, selectedSupplierIndex, suppliersData]);

  const toggleBranch = (index: number) =>
    setExpandedBranches((prev) => ({ ...prev, [index]: !prev[index] }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResponseMessage("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (validTypes.includes(droppedFile.type) || /\.(xlsx|xls)$/i.test(droppedFile.name)) {
      setFile(droppedFile);
      setResponseMessage("");
    } else {
      alert("برجاء رفع ملف Excel بصيغة .xlsx أو .xls فقط");
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
      setSuppliersData(data || []);
      setSelectedSupplierIndex(0);
      setExpandedBranches({});
      setResponseMessage("تم رفع الملف ومعالجة البيانات بنجاح!");
    } catch (error: unknown) {
      console.error(error);
      setResponseMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "فشل في رفع الملف، تحقق من السيرفر."
          : "حدث خطأ غير متوقع أثناء معالجة الملف."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentSupplier = suppliersData[selectedSupplierIndex];

  return (
    <div
      style={{
        padding: "30px 20px",
        maxWidth: 1100,
        margin: "auto",
        direction: "rtl",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s ease-in-out infinite;
        }

        @media print {
          .no-print, form, nav, button, .upload-card, .screen-view {
            display: none !important;
          }
          body {
            background: #fff !important;
            direction: rtl !important;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .voucher-page {
            position: relative;
            display: block !important;
            page-break-after: always !important;
            break-after: page !important;
            break-inside: avoid !important;
            max-width: 650px !important;
            margin: 0 auto 20px auto !important;
            padding: 10px 15px !important;
            box-sizing: border-box;
            overflow: hidden;
          }
          .voucher-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 55%;
            max-width: 320px;
            opacity: 0.08;
            z-index: 0;
            pointer-events: none;
          }
          .voucher-watermark img {
            width: 100%;
            height: auto;
            object-fit: contain;
          }
          .voucher-top-bar {
            position: relative;
            z-index: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            direction: rtl;
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: bold;
            color: #000;
          }
          .voucher-table {
            position: relative;
            z-index: 1;
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            direction: rtl;
            table-layout: fixed;
            background: transparent;
          }
          .voucher-table th, .voucher-table td {
            border: 1px solid #000 !important;
            padding: 3px 6px;
            height: 20px;
            vertical-align: middle;
            word-wrap: break-word;
            background: transparent;
          }
          .voucher-table th {
            font-weight: bold;
            text-align: center;
            color: #000;
            background-color: transparent;
          }
          .th-title-ar {
            display: block;
            font-size: 10px;
            color: #333;
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

      {/* منطقة رفع الملفات */}
      <div className="no-print">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h2 style={{ color: "#1e293b", margin: "0 0 8px 0", fontSize: 26, fontWeight: 700 }}>
            نظام المعالجة وإصدار إيصالات الموردين
          </h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
            قم برفع ملف الموردين بصيغة Excel لحساب الضرائب وتوزيع القيود المحاسبية للفروع تلقائياً
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            style={{
              background: isDragOver ? "#f0f7ff" : "#fff",
              border: `2px dashed ${isDragOver ? "#0284c7" : file ? "#10b981" : "#cbd5e1"}`,
              borderRadius: 16,
              padding: "40px 20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              position: "relative",
            }}
          >
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
            />
            <div style={{ pointerEvents: "none" }}>
              {file ? (
                <div>
                  <div style={{ fontSize: 42, marginBottom: 10 }}>📊</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{file.name}</div>
                  <div style={{ fontSize: 13, color: "#10b981", marginTop: 4, fontWeight: 500 }}>
                    جاهز للرفع والمعالجة ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 42, marginBottom: 10, color: "#64748b" }}>📁</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#334155" }}>
                    اسحب وأسقط ملف الـ Excel هنا، أو{" "}
                    <span style={{ color: "#2563eb", textDecoration: "underline" }}>اختر ملفاً</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>يدعم الصيغ التالية: XLSX, XLS</div>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button
              type="submit"
              disabled={loading || !file}
              style={{
                padding: "12px 32px",
                backgroundColor: loading || !file ? "#94a3b8" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || !file ? "not-allowed" : "pointer",
                boxShadow: loading || !file ? "none" : "0 4px 12px rgba(37,99,235,0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.2s ease",
              }}
            >
              {loading && <span className="spinner"></span>}
              {loading ? "جاري المعالجة واستخراج البيانات..." : "رفع ومعالجة الملف"}
            </button>
          </div>
        </form>

        {responseMessage && (
          <div
            style={{
              marginTop: 20,
              padding: "14px 20px",
              borderRadius: 10,
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: responseMessage.includes("نجاح") ? "#ecfdf5" : "#fef2f2",
              color: responseMessage.includes("نجاح") ? "#047857" : "#b91c1c",
              border: `1px solid ${responseMessage.includes("نجاح") ? "#a7f3d0" : "#fecaca"}`,
            }}
          >
            {responseMessage}
          </div>
        )}
      </div>

      {suppliersData.length > 0 && (
        <div style={{ marginTop: 35 }}>
          {/* تحكم تاريخ الفاتورة والبحث */}
          <div className="no-print" style={{ background: "#f8fafc", padding: "18px 20px", borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 20, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label htmlFor="voucherDateInput" style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>
                📅 تاريخ الفواتير للطباعة:
              </label>
              <input
                id="voucherDateInput"
                type="date"
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #94a3b8", fontSize: 14, outline: "none", cursor: "pointer" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="text"
                placeholder="🔍 بحث عن بند أو صنف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #94a3b8", fontSize: 14, outline: "none", width: 220 }}
              />
            </div>
          </div>

          <div
            className="no-print"
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: 12,
              marginBottom: 25,
            }}
          >
            {suppliersData.map((sup, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSupplierIndex(index);
                  setExpandedBranches({});
                }}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: selectedSupplierIndex === index ? 600 : 500,
                  backgroundColor: selectedSupplierIndex === index ? "#2563eb" : "#f1f5f9",
                  color: selectedSupplierIndex === index ? "#fff" : "#475569",
                  transition: "all 0.15s ease",
                }}
              >
                🚚 {sup.supplier_name}
              </button>
            ))}
          </div>

          {currentSupplier && (
            <div>
              <div className="screen-view">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                  <h3 style={{ margin: 0, color: "#1e293b", fontSize: 20 }}>بيانات المورد: {currentSupplier.supplier_name}</h3>
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(22,163,74,0.2)",
                    }}
                  >
                    🖨️ طباعة إيصالات الفروع
                  </button>
                </div>

                {/* كارت ملخص إحصائيات المورد */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #f8fafc 0% #f1f5f9 100%)",
                    border: "1px solid #cbd5e1",
                    borderRadius: 12,
                    padding: "20px",
                    marginBottom: 25,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14, borderBottom: "1px solid #e2e8f0", paddingBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16 }}>
                      📊 إحصائيات وتعاملات المورد الإجمالية
                    </div>
                    <div style={{ background: "#e0f2fe", color: "#0369a1", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: "bold" }}>
                      🏆 ترتيب المورد: رقم {currentSupplierRankInfo.rank} من أصل {currentSupplierRankInfo.totalCount} موردين
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 15 }}>
                    <div style={{ background: "#fff", padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>إجمالي العمليات:</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                        {currentSupplierRankInfo.data?.totalTx ?? 0} عملية
                      </div>
                    </div>

                    <div style={{ background: "#fff", padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>الإجمالي قبل الضريبة:</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#0284c7" }}>
                        {formatCurrency(currentSupplierRankInfo.data?.totalBefore)}
                      </div>
                    </div>

                    <div style={{ background: "#fff", padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>إجمالي قيمة الضريبة:</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#d97706" }}>
                        {formatCurrency(currentSupplierRankInfo.data?.totalTax)}
                      </div>
                    </div>

                    <div style={{ background: "#fff", padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>الإجمالي بعد الضريبة:</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#16a34a" }}>
                        {formatCurrency(currentSupplierRankInfo.data?.totalAfter)}
                      </div>
                    </div>
                  </div>
                </div>

                {currentSupplier.branches?.map((b, i) => (
                  <BranchCard
                    key={i}
                    branch={b}
                    isExpanded={!!expandedBranches[i]}
                    onToggle={() => toggleBranch(i)}
                    searchTerm={searchTerm}
                  />
                ))}
              </div>

              {/* نماذج الفواتير الخاصة بالطباعة */}
              {currentSupplier.branches?.map((branch, bIdx) => {
                const itemsList = branch.items || [];
                const purchaseItems: AggregatedItem[] = [];
                const operatingItems: AggregatedItem[] = [];

                itemsList.forEach((item) => {
                  const cleanedName = normalizeText(item.details);
                  (PURCHASE_CATEGORIES.has(cleanedName) ? purchaseItems : operatingItems).push(item);
                });

                const totalPurchasesAmount = purchaseItems.reduce((acc, i) => acc + (i.amount_before_tax || 0), 0);
                const totalOperatingAmount = operatingItems.reduce((acc, i) => acc + (i.amount_before_tax || 0), 0);
                const branchTax = branch.branch_total_tax ?? itemsList.reduce((acc, i) => acc + (i.tax_amount || 0), 0);
                const branchAfterTax =
                  branch.branch_total_after_tax ?? itemsList.reduce((acc, i) => acc + (i.amount_after_tax || 0), 0);

                // التحقق مما إذا كان المورد هو "المطبخ المركزي" لاستبدال حساب العهدة بحساب الموردين
                const isCentralKitchen = normalizeText(currentSupplier.supplier_name).includes("المطبخ المركزي");
                const creditAccountLabel = isCentralKitchen ? "حـ / حساب الموردين" : "حـ / العهده الإدارة";

                return (
                  <div key={bIdx} className="voucher-page">
                    <div className="voucher-watermark">
                      <img src="/Untitled-design-30.webp" alt="Logo watermark" />
                    </div>

                    <div className="voucher-top-bar">
                      <div>
                        المورد : {currentSupplier.supplier_name} - {branch.branch_name}
                      </div>
                      <div>التاريخ: {voucherDate}</div>
                    </div>

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
                        <tr>
                          <td></td>
                          <td></td>
                          <td className="txt-center bold-text">3</td>
                          <td className="txt-right bold-text">حـ / مذكورين</td>
                        </tr>

                        {purchaseItems.length > 0 && (
                          <>
                            <tr>
                              <td className="txt-center bold-text">{formatCurrency(totalPurchasesAmount)}</td>
                              <td></td>
                              <td className="txt-center">..</td>
                              <td className="txt-right bold-text">حـ / المشتريات</td>
                            </tr>
                            {purchaseItems.map((item, idx) => (
                              <tr key={`p-${idx}`}>
                                <td></td>
                                <td></td>
                                <td className="txt-center">{formatCurrency(item.amount_before_tax)}</td>
                                <td className="txt-right">{item.details}</td>
                              </tr>
                            ))}
                          </>
                        )}

                        {operatingItems.length > 0 && (
                          <>
                            <tr>
                              <td className="txt-center bold-text">{formatCurrency(totalOperatingAmount)}</td>
                              <td></td>
                              <td className="txt-center">.</td>
                              <td className="txt-right bold-text">حـ/م. تشغيل</td>
                            </tr>
                            {operatingItems.map((item, idx) => (
                              <tr key={`o-${idx}`}>
                                <td></td>
                                <td></td>
                                <td className="txt-center">{formatCurrency(item.amount_before_tax)}</td>
                                <td className="txt-right">{item.details}</td>
                              </tr>
                            ))}
                          </>
                        )}

                        <tr>
                          <td className="txt-center bold-text">{formatCurrency(branchTax)}</td>
                          <td></td>
                          <td className="txt-center">.</td>
                          <td className="txt-right bold-text">حـ / الضريبه</td>
                        </tr>

                        <tr>
                          <td></td>
                          <td></td>
                          <td className="txt-center">.</td>
                          <td className="txt-right">Vat</td>
                        </tr>

                        <tr>
                          <td></td>
                          <td></td>
                          <td className="txt-center">.</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td className="txt-center">.</td>
                          <td></td>
                        </tr>

                        <tr>
                          <td></td>
                          <td className="txt-center bold-text">{formatCurrency(branchAfterTax)}</td>
                          <td className="txt-center">.</td>
                          <td className="txt-right bold-text">{creditAccountLabel}</td>
                        </tr>

                        <tr>
                          <td></td>
                          <td></td>
                          <td className="txt-center">.</td>
                          <td></td>
                        </tr>

                        <tr>
                          <td className="txt-center bold-text">{formatCurrency(branchAfterTax)}</td>
                          <td className="txt-center bold-text">{formatCurrency(branchAfterTax)}</td>
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

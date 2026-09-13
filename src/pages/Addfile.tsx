import React, { useState, useMemo } from "react";
import axios from "axios";
import { uploadExcelFile } from "../api/axios";
import { type SupplierData, formatCurrency } from "../typesAndConstants";
import { BranchCard } from "./BranchCard";
import { VoucherPrintTemplate } from "./VoucherPrintTemplate";

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
    <div className="p-8 max-w-6xl mx-auto rtl font-sans">
      {/* منطقة رفع الملفات (تختفي عند الطباعة باستخدام print:hidden من تايلويند) */}
      <div className="print:hidden">
        <div className="text-center mb-8">
          <h2 className="text-slate-800 m-0 mb-2 text-3xl font-bold">
            نظام المعالجة وإصدار إيصالات الموردين
          </h2>
          <p className="text-slate-500 m-0 text-sm">
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
            className={`rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 shadow-sm relative border-2 border-dashed ${
              isDragOver ? "bg-sky-50 border-sky-500" : file ? "bg-white border-emerald-500" : "bg-white border-slate-300"
            }`}
          >
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="pointer-events-none">
              {file ? (
                <div>
                  <div className="text-5xl mb-3">📊</div>
                  <div className="text-base font-semibold text-slate-900">{file.name}</div>
                  <div className="text-sm text-emerald-600 mt-1 font-medium">
                    جاهز للرفع والمعالجة ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-3 text-slate-400">📁</div>
                  <div className="text-base font-semibold text-slate-700">
                    اسحب وأسقط ملف الـ Excel هنا، أو{" "}
                    <span className="text-blue-600 underline">اختر ملفاً</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">يدعم الصيغ التالية: XLSX, XLS</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={loading || !file}
              className={`py-3 px-8 text-white border-none rounded-xl text-base font-semibold inline-flex items-center gap-3 transition-all duration-200 ${
                loading || !file ? "bg-slate-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-lg shadow-blue-600/25"
              }`}
            >
              {loading && <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              {loading ? "جاري المعالجة واستخراج البيانات..." : "رفع ومعالجة الملف"}
            </button>
          </div>
        </form>

        {responseMessage && (
          <div
            className={`mt-6 p-4 rounded-xl text-center text-sm font-semibold border ${
              responseMessage.includes("نجاح") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </div>

      {suppliersData.length > 0 && (
        <div className="mt-10">
          {/* تحكم تاريخ الفاتورة والبحث */}
          <div className="print:hidden bg-slate-50 p-5 rounded-xl border border-slate-300 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="voucherDateInput" className="font-semibold text-slate-800 text-sm">
                📅 تاريخ الفواتير للطباعة:
              </label>
              <input
                id="voucherDateInput"
                type="date"
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                className="py-2 px-3 rounded-lg border border-slate-300 text-sm outline-none cursor-pointer bg-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="🔍 بحث عن بند أو صنف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 px-3.5 rounded-lg border border-slate-300 text-sm outline-none w-60 bg-white"
              />
            </div>
          </div>

          <div className="print:hidden flex gap-2.5 overflow-x-auto border-b-2 border-slate-200 pb-3 mb-6">
            {suppliersData.map((sup, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSupplierIndex(index);
                  setExpandedBranches({});
                }}
                className={`py-2.5 px-5 border-none rounded-lg cursor-pointer whitespace-nowrap transition-all duration-150 ${
                  selectedSupplierIndex === index ? "font-semibold bg-blue-600 text-white shadow-md shadow-blue-600/20" : "font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                🚚 {sup.supplier_name}
              </button>
            ))}
          </div>

          {currentSupplier && (
            <div>
              {/* مربع يعرض اسم المورد الحالي بوضوح */}
              <div className="print:hidden bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📌</span>
                  <span className="text-sm text-blue-900 font-semibold">المورد المختار حالياً:</span>
                  <span className="text-base text-blue-950 font-bold">{currentSupplier.supplier_name}</span>
                </div>
              </div>

              {/* واجهة العرض على الشاشة (تختفي عند الطباعة) */}
              <div className="print:hidden">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="m-0 text-slate-800 text-xl font-bold">بيانات المورد: {currentSupplier.supplier_name}</h3>
                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl font-semibold cursor-pointer shadow-md shadow-emerald-600/20 transition-all"
                  >
                    🖨️ طباعة إيصالات الفروع
                  </button>
                </div>

                {/* كارت ملخص إحصائيات المورد */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-300 rounded-2xl p-5 mb-6 shadow-sm">
                  <div className="flex justify-between items-center flex-wrap gap-3 mb-4 border-b border-slate-200 pb-3">
                    <div className="font-bold text-slate-900 text-base">
                      📊 إحصائيات وتعاملات المورد الإجمالية
                    </div>
                    <div className="bg-sky-100 text-sky-700 py-1.5 px-3.5 rounded-full text-xs font-bold">
                      🏆 ترتيب المورد: رقم {currentSupplierRankInfo.rank} من أصل {currentSupplierRankInfo.totalCount} موردين
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-xs text-slate-500 mb-1">إجمالي العمليات:</div>
                      <div className="text-lg font-bold text-slate-900">
                        {currentSupplierRankInfo.data?.totalTx ?? 0} عملية
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-xs text-slate-500 mb-1">الإجمالي قبل الضريبة:</div>
                      <div className="text-lg font-bold text-sky-600">
                        {formatCurrency(currentSupplierRankInfo.data?.totalBefore)}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-xs text-slate-500 mb-1">إجمالي قيمة الضريبة:</div>
                      <div className="text-lg font-bold text-amber-600">
                        {formatCurrency(currentSupplierRankInfo.data?.totalTax)}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-xs text-slate-500 mb-1">الإجمالي بعد الضريبة:</div>
                      <div className="text-lg font-bold text-emerald-600">
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

              {/* نماذج الفواتير الخاصة بالطباعة (تظهر فقط عند الطباعة باستخدام نظام Tailwind للـ Print) */}
              <div className="hidden print:block">
                {currentSupplier.branches?.map((branch, bIdx) => (
                  <VoucherPrintTemplate
                    key={bIdx}
                    currentSupplier={currentSupplier}
                    branch={branch}
                    bIdx={bIdx}
                    voucherDate={voucherDate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Addfile;

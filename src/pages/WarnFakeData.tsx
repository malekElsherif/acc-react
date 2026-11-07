// WarnFakeData.tsx
import React, { useMemo, useState } from "react";

export interface AuditWarning {
  severity: "error" | "warning";
  type: string;
  message: string;
  supplier?: string;
  branch?: string;
  details?: string;
  row_no?: string | number;
  invoice_no?: string | number;
  diff?: number;
}

interface AuditSummary {
  errors: number;
  warnings: number;
  status: string;
}

interface BranchAudit {
  branch_name: string;
  audit?: {
    status: string;
    tax_diff: number;
    after_tax_diff: number;
    expected_tax: number;
  };
}

interface WarnFakeDataProps {
  supplierName: string;
  warnings?: AuditWarning[];
  summary?: AuditSummary;
  branches?: BranchAudit[];
}

const TYPE_LABELS: Record<string, string> = {
  tax_mismatch: "ضريبة لا تساوي 5%",
  total_mismatch: "إجمالي لا يطابق الحساب",
  negative_amount: "مبلغ سالب",
  invalid_date: "تاريخ غير صالح",
  out_of_month: "تاريخ خارج الشهر",
  duplicate_row: "صف مكرر محتمل",
  invoice_multi_supplier: "فاتورة مع أكثر من مورد",
};

const fmt = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const WarnFakeData: React.FC<WarnFakeDataProps> = ({ supplierName, warnings = [], summary, branches = [] }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "error" | "warning">("all");

  const errors = warnings.filter((w) => w.severity === "error").length;
  const notices = warnings.length - errors;

  const mismatchedBranches = useMemo(
    () => branches.filter((b) => b.audit && b.audit.status !== "ok"),
    [branches]
  );

  const visible = useMemo(
    () => (filter === "all" ? warnings : warnings.filter((w) => w.severity === filter)),
    [warnings, filter]
  );

  // كل شيء سليم
  if (warnings.length === 0 && mismatchedBranches.length === 0) {
    return (
      <div dir="rtl" className="print:hidden bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-2.5">
        <span className="text-xl">✅</span>
        <span className="text-sm font-semibold text-emerald-800">
          فحص المورد «{supplierName}»: الضريبة 5% والإجماليات سليمة، ولا توجد ملاحظات.
        </span>
      </div>
    );
  }

  return (
    <div dir="rtl" className="print:hidden bg-red-50 border border-red-200 rounded-xl mb-6 overflow-hidden">
      {/* الشريط العلوي */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full p-4 flex items-center justify-between gap-3 flex-wrap cursor-pointer bg-transparent border-none text-right"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">⚠️</span>
          <span className="font-bold text-red-900 text-base">فحص الحسابات: يحتاج مراجعة ({supplierName})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold">
            {summary?.errors ?? errors} خطأ
          </span>
          <span className="bg-amber-100 text-amber-800 py-1 px-3 rounded-full text-xs font-bold">
            {summary?.warnings ?? notices} تنبيه
          </span>
          <span className="text-slate-500 font-bold">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="p-4 border-t border-red-200 bg-white">
          {/* فروع إجمالياتها غير مطابقة */}
          {mismatchedBranches.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3">
              <div className="font-bold text-red-800 text-sm mb-2">فروع إجمالي الضريبة فيها لا يطابق 5%:</div>
              <ul className="text-sm text-red-900 space-y-1 list-disc pr-5">
                {mismatchedBranches.map((b) => (
                  <li key={b.branch_name}>
                    <b>{b.branch_name}</b>: فرق الضريبة{" "}
                    <b dir="ltr">{fmt(b.audit?.tax_diff)}</b> | فرق الإجمالي{" "}
                    <b dir="ltr">{fmt(b.audit?.after_tax_diff)}</b>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* فلتر الخطورة */}
          {warnings.length > 0 && (
            <div className="flex gap-2 mb-3">
              {([
                ["all", `الكل (${warnings.length})`],
                ["error", `أخطاء (${errors})`],
                ["warning", `تنبيهات (${notices})`],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border-none cursor-pointer transition-colors ${
                    filter === key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* جدول الملاحظات */}
          {visible.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px] text-right">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    {["الخطورة", "النوع", "صف", "فاتورة", "الفرع", "البيان", "التفاصيل"].map((h) => (
                      <th key={h} className="p-2.5 border border-slate-300">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((w, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="p-2.5 border border-slate-200">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            w.severity === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {w.severity === "error" ? "خطأ" : "تنبيه"}
                        </span>
                      </td>
                      <td className="p-2.5 border border-slate-200 font-semibold">{TYPE_LABELS[w.type] ?? w.type}</td>
                      <td className="p-2.5 border border-slate-200">{w.row_no || "-"}</td>
                      <td className="p-2.5 border border-slate-200">{w.invoice_no || "-"}</td>
                      <td className="p-2.5 border border-slate-200">{w.branch}</td>
                      <td className="p-2.5 border border-slate-200">{w.details}</td>
                      <td className="p-2.5 border border-slate-200">{w.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WarnFakeData;

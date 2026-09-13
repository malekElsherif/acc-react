// BranchCard.tsx
import React, { useMemo } from "react";
import { type Branch, PURCHASE_CATEGORIES, normalizeText, formatCurrency, calculateTaxPercentage } from "../typesAndConstants";

interface BranchCardProps {
  branch: Branch;
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm: string;
}

export const BranchCard: React.FC<BranchCardProps> = ({ branch, isExpanded, onToggle, searchTerm }) => {
  const filteredItems = useMemo(() => {
    if (!branch.items) return [];
    if (!searchTerm.trim()) return branch.items;
    return branch.items.filter((item) =>
      item.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [branch.items, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl mb-4 bg-white shadow-sm overflow-hidden">
      <div
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        className={`p-[18px] cursor-pointer flex justify-between items-center transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
          isExpanded ? "bg-slate-50" : "bg-white"
        }`}
      >
        <div className="text-base text-slate-500 font-bold order-1">{isExpanded ? "▲" : "▼"}</div>

        <div dir="rtl" className="text-right order-2">
          <strong className="text-slate-900 text-base">🏢 فرع: {branch.branch_name}</strong>
          <div className="mt-1.5 text-slate-600 text-sm">
            عدد العمليات: <b className="text-slate-900">{branch.total_transactions ?? branch.items?.length ?? 0}</b> | صافي المشتريات:{" "}
            <b className="text-slate-900">{formatCurrency(branch.branch_total_before_tax)}</b> | الضريبة:{" "}
            <b className="text-slate-900">{formatCurrency(branch.branch_total_tax)}</b> | الإجمالي:{" "}
            <b className="text-slate-900">{formatCurrency(branch.branch_total_after_tax)}</b>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-[18px] border-t border-slate-200 bg-white">
          {filteredItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table dir="rtl" className="w-full border-collapse text-[13px] text-right">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
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
                      <th key={h} className="p-3.5 border border-slate-300">
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
                      <tr
                        key={`${item.details}-${idx}`}
                        className={`transition-colors duration-150 hover:bg-sky-50 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                      >
                        <td className="p-3.5 border border-slate-200">{idx + 1}</td>
                        <td className="p-3.5 border border-slate-200 font-semibold">{item.details}</td>
                        <td className="p-3.5 border border-slate-200">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              isPurchase ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isPurchase ? "مشتريات" : "مصروف تشغيل"}
                          </span>
                        </td>
                        <td className="p-3.5 border border-slate-200">{item.quantity}</td>
                        <td className="p-3.5 border border-slate-200">{formatCurrency(item.amount_before_tax)}</td>
                        <td className="p-3.5 border border-slate-200">{formatCurrency(item.tax_amount)}</td>
                        <td className="p-3.5 border border-slate-200 font-semibold text-sky-600">{taxPercentage}</td>
                        <td className="p-3.5 border border-slate-200">{formatCurrency(item.amount_after_tax)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-slate-400 text-[13px] text-center py-4">
              لا توجد بنود مطابقة للبحث داخل هذا الفرع.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

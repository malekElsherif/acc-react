// VoucherPrintTemplate.tsx
import React from "react";
import { type Branch, type SupplierData, type AggregatedItem, PURCHASE_CATEGORIES, normalizeText, formatCurrency } from "../typesAndConstants";

interface VoucherPrintTemplateProps {
  currentSupplier: SupplierData;
  branch: Branch;
  bIdx: number;
  voucherDate: string;
}

export const VoucherPrintTemplate: React.FC<VoucherPrintTemplateProps> = ({ currentSupplier, branch, bIdx, voucherDate }) => {
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
  const branchAfterTax = branch.branch_total_after_tax ?? itemsList.reduce((acc, i) => acc + (i.amount_after_tax || 0), 0);

  const normalizedBranchName = normalizeText(branch.branch_name);
  const isCentralKitchen = normalizedBranchName.includes("المطبخ") || normalizedBranchName.includes("المركزي");
  const creditAccountLabel = isCentralKitchen ? "حـ/ الموردين" : "حـ/ العهده الإدارة";

  return (
    <div
      key={bIdx}
      className="hidden print:block relative print:max-w-[650px] print:mx-auto print:mb-5 print:p-[10px_15px] box-border overflow-hidden print:break-after-page print:break-inside-avoid"
    >
      {/* العلامة المائية */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] max-w-[320px] opacity-[0.08] z-0 pointer-events-none">
        <img src="/Untitled-design-30.webp" alt="Logo watermark" className="w-full h-auto object-contain" />
      </div>

      {/* الشريط العلوي */}
      <div dir="rtl" className="relative z-10 flex justify-between items-center mb-2 text-[13px] font-bold text-black">
        <div>
          المورد : {currentSupplier.supplier_name} - {branch.branch_name}
        </div>
        <div>التاريخ: {voucherDate}</div>
      </div>

      {/* جدول القيد */}
      <table dir="rtl" className="relative z-10 w-full border-collapse text-[11px] table-fixed bg-transparent">
        <thead>
          <tr>
            <th style={{ width: "18%" }} className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent font-bold text-center text-black">
              Debit
              <span className="block text-[10px] text-gray-700 mt-px">مدين</span>
            </th>
            <th style={{ width: "18%" }} className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent font-bold text-center text-black">
              Credit
              <span className="block text-[10px] text-gray-700 mt-px">دائن</span>
            </th>
            <th style={{ width: "18%" }} className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent font-bold text-center text-black">
              Analysis
              <span className="block text-[10px] text-gray-700 mt-px">البيان</span>
            </th>
            <th style={{ width: "46%" }} className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent font-bold text-center text-black">
              Dis
              <span className="block text-[10px] text-gray-700 mt-px">الوصف المحاسبي</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center font-bold">3</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right pr-2 font-bold">حـ/ مذكورين</td>
          </tr>

          {purchaseItems.length > 0 && (
            <>
              <tr>
                <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center font-bold">{formatCurrency(totalPurchasesAmount)}</td>
                <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
                <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">..</td>
                <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right pr-2 font-bold">حـ/ المشتريات</td>
              </tr>
              {purchaseItems.map((item, idx) => (
                <tr key={`p-${idx}`}>
                  <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
                  <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
                  <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">{formatCurrency(item.amount_before_tax)}</td>
                  <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right pr-[35px]">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.details}
                  </td>
                </tr>
              ))}
            </>
          )}

          {operatingItems.length > 0 && (
            <>
              <tr>
                <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center font-bold">{formatCurrency(totalOperatingAmount)}</td>
                <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
                <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">.</td>
                <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right pr-2 font-bold">حـ/م. تشغيل</td>
              </tr>
              {operatingItems.map((item, idx) => (
                <tr key={`o-${idx}`}>
                  <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
                  <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
                  <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">{formatCurrency(item.amount_before_tax)}</td>
                  <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right pr-[35px]">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.details}
                  </td>
                </tr>
              ))}
            </>
          )}

          <tr>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center font-bold">{formatCurrency(branchTax)}</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">.</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right pr-2 font-bold">حـ/ الضريبه</td>
          </tr>

          <tr>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">.</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right pr-[35px]">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Vat
            </td>
          </tr>

          <tr>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center font-bold">{formatCurrency(branchAfterTax)}</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">.</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right font-bold">{creditAccountLabel}</td>
          </tr>

          {/* صف فارغ تحت العهدة/الموردين */}
          <tr>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent"></td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">.</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right pr-[35px]">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </td>
          </tr>

          <tr>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center font-bold">{formatCurrency(branchAfterTax)}</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center font-bold">{formatCurrency(branchAfterTax)}</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-center">.</td>
            <td className="border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent text-right font-bold">المجموع الكلي</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

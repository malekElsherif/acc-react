// VoucherPrintTemplate.tsx
import React from "react";
import { type Branch, type SupplierData, type AggregatedItem, PURCHASE_CATEGORIES, normalizeText, formatCurrency } from "../typesAndConstants";

// ===== ثوابت التنسيق (نفس الـ classes الأصلية) =====
const CELL = "border border-black p-[3px_6px] h-5 align-middle break-words bg-transparent";
const TH = `${CELL} font-bold text-center text-black`;
const INDENT = "\u00A0".repeat(7);

interface VoucherPrintTemplateProps {
  currentSupplier: SupplierData;
  branch: Branch;
  bIdx: number;
  voucherDate: string;
  isLast?: boolean; // آخر قيد: من غير فاصل صفحة بعده
}

export const VoucherPrintTemplate: React.FC<VoucherPrintTemplateProps> = ({
  currentSupplier,
  branch,
  voucherDate,
  isLast = false,
}) => {
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
      className={`hidden print:block relative print:max-w-[650px] print:mx-auto print:mb-5 print:p-[10px_15px] box-border overflow-hidden print:break-inside-avoid ${
        isLast ? "" : "print:break-after-page"
      }`}
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
            <th style={{ width: "18%" }} className={TH}>
              Debit
              <span className="block text-[10px] text-gray-700 mt-px">مدين</span>
            </th>
            <th style={{ width: "18%" }} className={TH}>
              Credit
              <span className="block text-[10px] text-gray-700 mt-px">دائن</span>
            </th>
            <th style={{ width: "18%" }} className={TH}>
              Analysis
              <span className="block text-[10px] text-gray-700 mt-px">البيان</span>
            </th>
            <th style={{ width: "46%" }} className={TH}>
              Dis
              <span className="block text-[10px] text-gray-700 mt-px">الوصف المحاسبي</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* حـ/ مذكورين */}
          <tr>
            <td className={CELL}></td>
            <td className={CELL}></td>
            <td className={`${CELL} text-center font-bold`}>3</td>
            <td className={`${CELL} text-right pr-2 font-bold`}>حـ/ مذكورين</td>
          </tr>

          {/* حـ/ المشتريات */}
          {purchaseItems.length > 0 && (
            <>
              <tr>
                <td className={`${CELL} text-center font-bold`}>{formatCurrency(totalPurchasesAmount)}</td>
                <td className={CELL}></td>
                <td className={`${CELL} text-center`}>..</td>
                <td className={`${CELL} text-right pr-2 font-bold`}>حـ/ المشتريات</td>
              </tr>
              {purchaseItems.map((item, idx) => (
                <tr key={`p-${idx}`}>
                  <td className={CELL}></td>
                  <td className={CELL}></td>
                  <td className={`${CELL} text-center`}>{formatCurrency(item.amount_before_tax)}</td>
                  <td className={`${CELL} text-right pr-[35px]`}>
                    {INDENT}{item.details}
                  </td>
                </tr>
              ))}
            </>
          )}

          {/* حـ/م. تشغيل */}
          {operatingItems.length > 0 && (
            <>
              <tr>
                <td className={`${CELL} text-center font-bold`}>{formatCurrency(totalOperatingAmount)}</td>
                <td className={CELL}></td>
                <td className={`${CELL} text-center`}>.</td>
                <td className={`${CELL} text-right pr-2 font-bold`}>حـ/م. تشغيل</td>
              </tr>
              {operatingItems.map((item, idx) => (
                <tr key={`o-${idx}`}>
                  <td className={CELL}></td>
                  <td className={CELL}></td>
                  <td className={`${CELL} text-center`}>{formatCurrency(item.amount_before_tax)}</td>
                  <td className={`${CELL} text-right pr-[35px]`}>
                    {INDENT}{item.details}
                  </td>
                </tr>
              ))}
            </>
          )}

          {/* حـ/ الضريبه */}
          <tr>
            <td className={`${CELL} text-center font-bold`}>{formatCurrency(branchTax)}</td>
            <td className={CELL}></td>
            <td className={`${CELL} text-center`}>.</td>
            <td className={`${CELL} text-right pr-2 font-bold`}>حـ/ الضريبه</td>
          </tr>
          <tr>
            <td className={CELL}></td>
            <td className={CELL}></td>
            <td className={`${CELL} text-center`}>.</td>
            <td className={`${CELL} text-right pr-[35px]`}>{INDENT}Vat</td>
          </tr>

          {/* حـ/ الموردين أو العهدة */}
          <tr>
            <td className={CELL}></td>
            <td className={`${CELL} text-center font-bold`}>{formatCurrency(branchAfterTax)}</td>
            <td className={`${CELL} text-center`}>.</td>
            <td className={`${CELL} text-right font-bold`}>{creditAccountLabel}</td>
          </tr>

          {/* اسم المورد تحت حـ/ الموردين (للمطبخ المركزي فقط) */}
          <tr>
            <td className={CELL}></td>
            <td className={CELL}></td>
            <td className={`${CELL} text-center`}>.</td>
            <td className={`${CELL} text-right pr-[35px]`}>
              {INDENT}{isCentralKitchen ? currentSupplier.supplier_name : ""}
            </td>
          </tr>

          {/* المجموع الكلي */}
          <tr>
            <td className={`${CELL} text-center font-bold`}>{formatCurrency(branchAfterTax)}</td>
            <td className={`${CELL} text-center font-bold`}>{formatCurrency(branchAfterTax)}</td>
            <td className={`${CELL} text-center`}>.</td>
            <td className={`${CELL} text-right font-bold`}>المجموع الكلي</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ===== طباعة كل الموردين: قيد لكل مورد ولكل فرع =====
interface AllVouchersPrintProps {
  suppliers: SupplierData[];
  voucherDate: string;
}

export const AllVouchersPrint: React.FC<AllVouchersPrintProps> = ({ suppliers, voucherDate }) => {
  const vouchers = suppliers.flatMap((supplier) =>
    (supplier.branches || []).map((branch) => ({ supplier, branch }))
  );

  return (
    <>
      {vouchers.map(({ supplier, branch }, i) => (
        <VoucherPrintTemplate
          key={`${supplier.supplier_name}-${branch.branch_name}-${i}`}
          currentSupplier={supplier}
          branch={branch}
          bIdx={i}
          voucherDate={voucherDate}
          isLast={i === vouchers.length - 1}
        />
      ))}
    </>
  );
};

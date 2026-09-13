export const PURCHASE_CATEGORIES = new Set([
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

export const normalizeText = (text: string): string => {
  if (!text) return "";
  return text.trim().replace(/[أإآ]/g, "ا").replace(/\s+/g, " ");
};

export interface AggregatedItem {
  details: string;
  quantity: number;
  amount_before_tax: number;
  tax_amount: number;
  amount_after_tax: number;
}

export interface Branch {
  branch_name: string;
  total_transactions?: number;
  branch_total_before_tax?: number;
  branch_total_tax?: number;
  branch_total_after_tax?: number;
  items?: AggregatedItem[];
}

export interface SupplierData {
  supplier_name: string;
  total_amount_before_tax?: number;
  total_tax_amount?: number;
  total_amount_after_tax?: number;
  branches: Branch[];
}

export const formatCurrency = (val?: number) =>
  (val ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const calculateTaxPercentage = (beforeTax?: number, tax?: number): string => {
  if (!beforeTax || beforeTax === 0 || !tax) return "0%";
  const percentage = (tax / beforeTax) * 100;
  return `${Number(percentage.toFixed(1))}%`;
};

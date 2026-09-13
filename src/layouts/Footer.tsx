import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer dir="rtl" className="border-t border-slate-200 bg-slate-50 mt-16 text-slate-600">
      <div className="max-w-[1100px] mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* معلومات النظام والوصف المختصر */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-right">
          <span className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>🏢</span> نظام إدارة الموردين والإيصالات
          </span>
          <p className="text-xs text-slate-500">
            النظام المتكامل لمعالجة الفواتير، حساب الضرائب، وتوزيع المصروفات على الفروع بدقة.
          </p>
        </div>

        {/* روابط سريعة للتنقل */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            الرئيسية
          </Link>
          <Link to="/upload" className="hover:text-blue-600 transition-colors">
            رفع الملفات
          </Link>
        </div>

        {/* حقوق النشر */}
        <div className="text-xs text-slate-400 border-t md:border-t-0 pt-4 md:pt-0 border-slate-200 w-full md:w-auto text-center">
          © {year} جميع الحقوق محفوظة
        </div>

      </div>
    </footer>
  );
};

export default Footer; // ملاحظة: استبدلها بـ export default Footer;

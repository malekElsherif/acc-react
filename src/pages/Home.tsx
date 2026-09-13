import { Link } from 'react-router-dom';

const Home = () => {
  // تعريف كروت المؤشرات بناءً على وظيفة كل مؤشر في النظام
  const features = [
    {
      title: "إدارة الموردين",
      description: "تتبع وحصر بيانات الموردين المسجلين وتصنيفهم وفقاً لبنود التوريد.",
      icon: "🚚",
      accent: "#9C7A3C",
    },
    {
      title: "معالجة الملفات",
      description: "تحليل شيتات الأكسيل واستخراج بيانات الفواتير والإيصالات تلقائياً.",
      icon: "📊",
      accent: "#3C5A78",
    },
    {
      title: "حساب الضرائب والخصم",
      description: "احتساب ضريبة القيمة المضافة والقيمة الصافية لكل إيصال وفرع.",
      icon: "🧾",
      accent: "#8C2F2F",
    },
    {
      title: "توزيع الفروع",
      description: "توجيه المبالغ والمصروفات حسب كل فرع مع إمكانية طباعة الإيصالات.",
      icon: "🏢",
      accent: "#3F6B52",
    },
  ];

  return (
    <div
      dir="rtl"
      className="max-w-[1100px] mx-auto px-5 py-10 font-['IBM_Plex_Sans_Arabic',_'Segoe_UI',_sans-serif] bg-[#F1F0EC]"
    >
      {/* 1. رأس الصفحة — بأسلوب صفحة السجل المحاسبي */}
      <div className="border-y border-[#D8D3C7] py-10 mb-12 flex flex-wrap items-center justify-between gap-10">
        <div className="max-w-[540px]">
          <h1 className="font-['Markazi_Text',_serif] text-[32px] md:text-[38px] font-semibold text-[#1E2A38] leading-tight mb-3">
            نظام إدارة الموردين والإيصالات
          </h1>
          <p className="text-[#5B6572] text-[15px] leading-[1.8] max-w-[70ch]">
            معالجة ملفات الأكسيل، وتوجيه الحسابات تلقائياً بين المشتريات ومصروفات التشغيل، وإصدار إيصالات مطبوعة للفروع.
          </p>
        </div>

        <Link
          to="/upload"
          className="group shrink-0 relative w-[128px] h-[128px] -rotate-6 rounded-full border-2 border-dashed border-[#8C2F2F] flex flex-col items-center justify-center gap-1 text-[#8C2F2F] hover:bg-[#8C2F2F] hover:text-[#F1F0EC] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C2F2F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1F0EC]"
        >
          <span className="text-[22px] leading-none">+</span>
          <span className="text-[14px] font-semibold leading-snug text-center px-3">
            رفع ملف
            <br />
            جديد
          </span>
        </Link>
      </div>

      {/* 2. وظائف النظام الأساسية — سجل بنود بدلاً من كروت متطابقة */}
      <div className="flex items-center gap-4 mb-2">
        <h3 className="font-['Markazi_Text',_serif] text-[20px] font-semibold text-[#1E2A38] whitespace-nowrap">
          الوظائف والخدمات الأساسية
        </h3>
        <div className="flex-1 h-px bg-[#D8D3C7]" />
      </div>
      <div className="mb-14">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 py-5 border-b border-[#D8D3C7] last:border-b-0"
          >
            <div className="w-[3px] self-stretch shrink-0" style={{ backgroundColor: item.accent }} />
            <div className="text-[24px] leading-none pt-0.5 shrink-0" aria-hidden="true">
              {item.icon}
            </div>
            <div>
              <div className="text-[16px] font-semibold text-[#1E2A38] mb-1">{item.title}</div>
              <div className="text-[13.5px] text-[#5B6572] leading-relaxed max-w-[62ch]">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. المهام السريعة */}
      <div className="flex items-center gap-4 mb-5">
        <h3 className="font-['Markazi_Text',_serif] text-[20px] font-semibold text-[#1E2A38] whitespace-nowrap">
          المهام والإجراءات
        </h3>
        <div className="flex-1 h-px bg-[#D8D3C7]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        <div className="bg-[#FBFAF7] border border-[#D8D3C7] rounded-md p-6 flex flex-col justify-between">
          <div>
            <div className="text-[28px] mb-3" aria-hidden="true">📂</div>
            <h4 className="text-[16px] font-semibold text-[#1E2A38] mb-2">معالجة شيت أكسيل</h4>
            <p className="text-[13.5px] text-[#5B6572] leading-relaxed mb-6">
              رفع ملفات الموردين وتوزيع المبالغ والضرائب على الفروع مع إمكانية طباعة الإيصالات مباشرة.
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 text-[#8C2F2F] font-semibold text-[14px] hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C2F2F] rounded-sm w-fit"
          >
            الانتقال لصفحة الرفع ←
          </Link>
        </div>

        <div className="bg-[#FBFAF7] border border-[#D8D3C7] rounded-md p-6 flex flex-col justify-between">
          <div>
            <div className="text-[28px] mb-3" aria-hidden="true">🧾</div>
            <h4 className="text-[16px] font-semibold text-[#1E2A38] mb-2">قواعد التبويب والتصنيف</h4>
            <p className="text-[13.5px] text-[#5B6572] leading-relaxed mb-6">
              استعراض بنود المشتريات المعرفة في النظام (لحوم، دواجن، أسماك...) ومقارنتها بمصروفات التشغيل.
            </p>
          </div>
          <span className="text-[13px] text-[#8C8478] font-medium">مُفعلة تلقائياً أثناء المعالجة</span>
        </div>
      </div>
    </div>
  );
};

export default Home;

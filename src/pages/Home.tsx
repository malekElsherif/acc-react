import { Link } from 'react-router-dom';

const Home = () => {
  // تعريف كروت المؤشرات بناءً على وظيفة كل مؤشر في النظام
  const features = [
    {
      title: "إدارة الموردين",
      description: "تتبع وحصر بيانات الموردين المسجلين وتصنيفهم وفقاً لبنود التوريد.",
      icon: "🚚",
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      title: "معالجة الملفات",
      description: "تحليل شيتات الأكسيل واستخراج بيانات الفواتير والإيصالات تلقائياً.",
      icon: "📊",
      color: "#16a34a",
      bg: "#f0fdf4"
    },
    {
      title: "حساب الضرائب والخصم",
      description: "احتساب ضريبة القيمة المضافة والقيمة الصافية لكل إيصال وفرع.",
      icon: "🧾",
      color: "#d97706",
      bg: "#fffbeb"
    },
    {
      title: "توزيع الفروع",
      description: "توجيه المبالغ والمصروفات حسب كل فرع مع إمكانية طباعة الإيصالات.",
      icon: "🏢",
      color: "#9333ea",
      bg: "#faf5ff"
    },
  ];

  return (
    <div
      style={{
        padding: "30px 20px",
        maxWidth: "1100px",
        margin: "auto",
        direction: "rtl",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* 1. قسم الترحيب الرئيسي (Hero Section) */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: "20px",
          padding: "35px 30px",
          color: "#fff",
          marginBottom: "30px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "700" }}>
            مرحباً بك في نظام إدارة الموردين والإيصالات 👋
          </h1>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "15px", maxWidth: "600px", lineHeight: "1.6" }}>
            قم بمعالجة ملفات الأكسيل، توجيه الحسابات تلقائياً بين المشتريات ومصروفات التشغيل، وإصدار إيصالات مطبوعة للفروع بسهولة ودقة.
          </p>
        </div>
        <div>
          <Link
            to="/upload"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
              transition: "transform 0.2s ease",
            }}
          >
            ➕ رفع ملف جديد
          </Link>
        </div>
      </div>

      {/* 2. وظائف النظام الأساسية (System Core Functions) */}
      <h3 style={{ color: "#1e293b", fontSize: "18px", marginBottom: "15px", fontWeight: "700" }}>
        الوظائف والخدمات الأساسية
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        {features.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: item.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                {item.title}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. المهام السريعة (Quick Actions) */}
      <h3 style={{ color: "#1e293b", fontSize: "18px", marginBottom: "15px", fontWeight: "700" }}>
        المهام والإجراءات
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📂</div>
            <h4 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "16px" }}>
              معالجة شيت أكسيل
            </h4>
            <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "13px", lineHeight: "1.5" }}>
              رفع ملفات الموردين وتوزيع المبالغ والضرائب على الفروع مع إمكانية طباعة الإيصالات مباشرة.
            </p>
          </div>
          <Link
            to="/upload"
            style={{
              color: "#2563eb",
              fontWeight: "600",
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            الانتقال لصفحة الرفع ←
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🧾</div>
            <h4 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "16px" }}>
              قواعد التبويب والتصنيف
            </h4>
            <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "13px", lineHeight: "1.5" }}>
              استعراض بنود المشتريات المعرفة في النظام (لحوم، دواجن، أسماك...) ومقارنتها بمصروفات التشغيل.
            </p>
          </div>
          <span style={{ color: "#94a3b8", fontWeight: "500", fontSize: "13px" }}>
            مُفعلة تلقائياً أثناء المعالجة
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;

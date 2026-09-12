import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Addfile from './pages/Addfile';
import Home from './pages/Home';

// مكون صفحة 404 بتصميم مميز
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '80px 20px', direction: 'rtl' }}>
    <div style={{ fontSize: '64px', marginBottom: '10px' }}>🔍</div>
    <h2 style={{ fontSize: '28px', color: '#1e293b', margin: '0 0 10px 0' }}>404 - الصفحة غير موجودة</h2>
    <p style={{ color: '#64748b', marginBottom: '25px' }}>العنوان الذي تحاول الوصول إليه غير موجود أو تم تحريكه.</p>
    <Link
      to="/"
      style={{
        padding: '10px 24px',
        backgroundColor: '#2563eb',
        color: '#fff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600'
      }}
    >
      العودة للرئيسية
    </Link>
  </div>
);

const App = () => {
  const location = useLocation();

  // فحص ما إذا كان الرابط الحالي هو النشط
  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. شريط التنقل العلوي (Navbar) - يتم إخفاؤه أثناء الطباعة */}
      <header
        className="no-print"
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 20px',
            height: '65px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            direction: 'rtl'
          }}
        >
          {/* الشعار واسم النظام */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: '#2563eb',
                color: '#fff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            >
              📊
            </div>
            <div>
              <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '16px' }}>نظام الإيصالات</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>معالجة وحسابات الموردين</div>
            </div>
          </Link>

          {/* روابط التنقل الرئيسية */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <Link
              to="/"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.15s ease',
                backgroundColor: isActive('/') ? '#eff6ff' : 'transparent',
                color: isActive('/') ? '#2563eb' : '#475569'
              }}
            >
              الرئيسية
            </Link>
            <Link
              to="/upload"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.15s ease',
                backgroundColor: isActive('/upload') ? '#eff6ff' : 'transparent',
                color: isActive('/upload') ? '#2563eb' : '#475569'
              }}
            >
              رفع ملف أكسيل
            </Link>
          </nav>

          {/* زر التفاعل السريع */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/upload"
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              ➕ معالجة جديدة
            </Link>
          </div>
        </div>
      </header>

      {/* 2. محتوى الصفحات والمسارات */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Addfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 3. تذييل الصفحة (Footer) - معزول عن الطباعة */}
      <footer
        className="no-print"
        style={{
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '20px 0',
          marginTop: '40px',
          direction: 'rtl'
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: '#64748b'
          }}
        >
          <div>© {new Date().getFullYear()} نظام معالجة الموردين وإصدار الإيصالات المحاسبية</div>
          <div>دعم صيغ Excel (.xlsx, .xls)</div>
        </div>
      </footer>
    </div>
  );
};

export default App;

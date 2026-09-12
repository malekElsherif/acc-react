import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  // فحص ما إذا كان الرابط الحالي هو النشط
  const isActive = (path: string) => location.pathname === path;

  const navLinkStyle = (path: string) => ({
    padding: '10px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.15s ease',
    backgroundColor: isActive(path) ? '#eff6ff' : 'transparent',
    color: isActive(path) ? '#2563eb' : '#475569',
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* أنماط مسؤولة عن التجاوب مع أحجام الشاشات المختلفة */}
      <style>{`
        .app-header-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          direction: rtl;
        }
        .app-nav-desktop {
          display: flex;
          gap: 8px;
        }
        .app-cta-desktop {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .app-hamburger-btn {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #1e293b;
          padding: 4px 8px;
        }
        .app-mobile-menu {
          display: none;
        }
        .app-logo-subtitle {
          display: block;
        }

        @media (max-width: 768px) {
          .app-header-inner {
            padding: 0 14px;
            height: 58px;
          }
          .app-nav-desktop,
          .app-cta-desktop {
            display: none;
          }
          .app-hamburger-btn {
            display: block;
          }
          .app-logo-subtitle {
            display: none;
          }
          .app-mobile-menu.open {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 10px 14px 16px 14px;
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            direction: rtl;
          }
          .app-mobile-menu a {
            padding: 12px 14px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
          }
          .app-footer-inner {
            flex-direction: column;
            gap: 6px;
            text-align: center;
          }
        }

        @media (max-width: 420px) {
          .app-logo-title {
            font-size: 14px !important;
          }
          .app-logo-icon {
            width: 32px !important;
            height: 32px !important;
            font-size: 17px !important;
          }
        }
      `}</style>

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
        <div className="app-header-inner">
          {/* الشعار واسم النظام */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div
              className="app-logo-icon"
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
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              📊
            </div>
            <div>
              <div className="app-logo-title" style={{ color: '#0f172a', fontWeight: '700', fontSize: '16px' }}>
                نظام الإيصالات
              </div>
              <div className="app-logo-subtitle" style={{ color: '#64748b', fontSize: '11px' }}>
                معالجة وحسابات الموردين
              </div>
            </div>
          </Link>

          {/* روابط التنقل الرئيسية - سطح المكتب */}
          <nav className="app-nav-desktop">
            <Link to="/" style={navLinkStyle('/')}>
              الرئيسية
            </Link>
            <Link to="/upload" style={navLinkStyle('/upload')}>
              رفع ملف أكسيل
            </Link>
          </nav>

          {/* زر التفاعل السريع - سطح المكتب */}
          <div className="app-cta-desktop">
            <Link
              to="/upload"
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
              }}
            >
              ➕ معالجة جديدة
            </Link>
          </div>

          {/* زر القائمة - الهواتف فقط */}
          <button
            className="app-hamburger-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="فتح القائمة"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* القائمة المنسدلة للهواتف */}
        <div className={`app-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{ backgroundColor: isActive('/') ? '#eff6ff' : 'transparent', color: isActive('/') ? '#2563eb' : '#334155' }}
          >
            الرئيسية
          </Link>
          <Link
            to="/upload"
            onClick={() => setMenuOpen(false)}
            style={{
              backgroundColor: isActive('/upload') ? '#eff6ff' : 'transparent',
              color: isActive('/upload') ? '#2563eb' : '#334155',
            }}
          >
            رفع ملف أكسيل
          </Link>
          <Link
            to="/upload"
            onClick={() => setMenuOpen(false)}
            style={{ backgroundColor: '#2563eb', color: '#fff', marginTop: '6px', textAlign: 'center' }}
          >
            ➕ معالجة جديدة
          </Link>
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
          className="app-footer-inner"
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

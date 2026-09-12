import { Routes, Route, Link } from 'react-router-dom';
import Addfile from './pages/Addfile';

// مكون بسيط للصفحة الرئيسية كمثال
const Home = () => <h2>الصفحة الرئيسية</h2>;
const NotFound = () => <h2>404 - الصفحة غير موجودة</h2>;

const App = () => {
  return (
    <div>
      {/* شريط التنقل (Navigation) */}
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>الرئيسية</Link>
        <Link to="/upload">رفع الملفات</Link>
      </nav>

      {/* تعريف المسارات */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Addfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

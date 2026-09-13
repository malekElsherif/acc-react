import { Routes, Route } from 'react-router-dom';
import Addfile from './pages/Addfile';
import Home from './pages/Home';
import './App.css'
import MainLayout from './layouts/MainLayout';


// يمكنك لاحقاً نقل صفحة 404 إلى ملف منفصل ضمن المكونات
const NotFound = () => (
  <div className="text-center py-20 px-5 rtl">
    <div className="text-6xl mb-2.5">🔍</div>
    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">404 - الصفحة غير موجودة</h2>
    <p className="text-slate-500 mb-6 text-sm md:text-base">العنوان الذي تحاول الوصول إليه غير موجود أو تم تحريكه.</p>
  </div>
);

const App = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans rtl">
      <Routes>
        <Route element={<MainLayout/>}>


        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Addfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

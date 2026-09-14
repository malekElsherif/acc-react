import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F1F0EC] flex flex-col">
      {/* إضافة print:hidden هنا لإخفاء النافبار عند الطباعة */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* إضافة print:hidden هنا أيضاً لإخفاء الفوتر عند الطباعة */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;

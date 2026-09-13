import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "الرئيسية", end: true },
  { to: "/upload", label: "رفع ملف" },
];

const Navbar = () => {
  return (
    <div dir="rtl" className="bg-[#1E2A38]">
      <div className="max-w-[1100px] mx-auto px-5 h-[68px] flex items-center justify-between gap-8">
        {/* الشعار */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F1F0EC] rounded-sm"
        >
          <span className="w-8 h-8 rounded-full border-2 border-dashed border-[#F1F0EC]/70 flex items-center justify-center text-[13px] font-bold text-[#F1F0EC]">
            م
          </span>
          <span className="font-['Markazi_Text',_serif] text-[20px] font-semibold text-[#F1F0EC] whitespace-nowrap">
            نظام الموردين والإيصالات
          </span>
        </NavLink>

        {/* الروابط */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative px-4 py-2 text-[14.5px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F1F0EC] rounded-sm ${
                  isActive ? "text-[#F1F0EC]" : "text-[#F1F0EC]/60 hover:text-[#F1F0EC]/90"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute right-4 left-4 -bottom-[1px] h-[2px] bg-[#8C2F2F]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

import {
  LayoutDashboard,
  Database,
  ShieldCheck,
  Archive,
  Settings,
  X,
} from "lucide-react";

function Sidebar({
  activePage,
  setActivePage,
}) {
  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Sources",
      icon: Database,
    },
    {
      name: "Verification",
      icon: ShieldCheck,
    },
    {
      name: "Archived",
      icon: Archive,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-slate-950 text-white flex-col sticky top-0 h-screen">

      <div className="px-6 py-6 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
            SX
          </div>

          <div>
            <h1 className="font-bold text-lg">
              Source X
            </h1>

            <p className="text-xs text-slate-500">
              Admin Console
            </p>
          </div>

        </div>

      </div>

      <div className="p-4">

        <p className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold px-3 mb-3">
          Workspace
        </p>

        <nav className="space-y-1">

          {menu.map((item) => {

            const Icon = item.icon;

            const active =
              activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() =>
                  setActivePage(item.name)
                }
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >

                <Icon size={18} />

                {item.name}

              </button>
            );
          })}

        </nav>

      </div>

      <div className="mt-auto p-4 border-t border-slate-800">

        <div className="flex items-center gap-3 px-3 py-2">

          <Settings
            size={18}
            className="text-slate-500"
          />

          <span className="text-sm text-slate-400">
            System Settings
          </span>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
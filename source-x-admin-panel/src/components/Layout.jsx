import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({
  children,
  user,
  activePage,
  setActivePage,
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 min-w-0">

        <Header user={user} />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;
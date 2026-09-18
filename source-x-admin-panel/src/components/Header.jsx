import {
  Bell,
  LogOut,
  UserCircle,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

function Header({ user }) {

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">

      <div className="lg:hidden">

        <h1 className="font-bold text-lg">
          Source X
        </h1>

      </div>

      <div className="ml-auto flex items-center gap-4">

        <button className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
          <Bell size={19} />
        </button>

        <div className="hidden sm:block w-px h-7 bg-slate-200" />

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <UserCircle size={20} />
          </div>

          <div className="hidden sm:block">

            <p className="text-sm font-semibold">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              {user?.email}
            </p>

          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="ml-2 text-slate-400 hover:text-red-600"
          >
            <LogOut size={18} />
          </button>

        </div>

      </div>

    </header>
  );
}

export default Header;
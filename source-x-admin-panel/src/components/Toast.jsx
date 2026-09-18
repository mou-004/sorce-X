import {
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

function Toast({
  toast,
  onClose,
}) {
  if (!toast) return null;

  const success = toast.type === "success";

  return (
    <div className="fixed bottom-5 right-5 z-[100]">

      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-4 flex items-center gap-3 min-w-[300px]">

        {success ? (
          <CheckCircle
            size={20}
            className="text-emerald-600"
          />
        ) : (
          <AlertCircle
            size={20}
            className="text-red-600"
          />
        )}

        <p className="text-sm font-medium flex-1">
          {toast.message}
        </p>

        <button onClick={onClose}>
          <X
            size={16}
            className="text-slate-400"
          />
        </button>

      </div>

    </div>
  );
}

export default Toast;
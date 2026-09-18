import { AlertTriangle, X } from "lucide-react";

function ConfirmModal({
  title,
  message,
  confirmText,
  onConfirm,
  onClose,
  loading,
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={21} />
          </div>

          <div className="flex-1">

            <h3 className="font-bold text-lg">
              {title}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              {message}
            </p>

          </div>

          <button onClick={onClose}>
            <X
              size={18}
              className="text-slate-400"
            />
          </button>

        </div>

        <div className="flex justify-end gap-3 mt-7">

          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;
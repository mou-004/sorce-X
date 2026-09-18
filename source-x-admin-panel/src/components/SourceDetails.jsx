import {
  X,
  MapPin,
  Star,
  Calendar,
  Package,
  FileText,
} from "lucide-react";

function SourceDetails({
  source,
  onClose,
}) {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="p-6 border-b border-slate-200 flex justify-between">

          <div>

            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
              Source Profile
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {source.sourceName}
            </h2>

            <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
              <MapPin size={15} />
              {source.location || "Location not provided"}
            </div>

          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          >
            <X size={19} />
          </button>

        </div>

        <div className="p-6 space-y-6">

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

            <Info
              label="Category"
              value={source.category}
            />

            <Info
              label="Verification"
              value={source.verificationStatus}
            />

            <Info
              label="Status"
              value={source.status}
            />

          </div>

          <div className="flex items-center gap-2">

            <Star
              size={19}
              className="text-yellow-500 fill-yellow-500"
            />

            <span className="font-semibold">
              {source.rating || "0.0"}
            </span>

            <span className="text-sm text-slate-500">
              Source rating
            </span>

          </div>

          <section>

            <div className="flex items-center gap-2 mb-4">

              <Package
                size={18}
                className="text-blue-600"
              />

              <h3 className="font-semibold">
                Products
              </h3>

            </div>

            <div className="space-y-3">

              {source.products?.map(
                (product, index) => (

                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl p-4"
                  >

                    <div className="flex justify-between">

                      <h4 className="font-semibold">
                        {product.name ||
                          "Unnamed product"}
                      </h4>

                      <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                        {product.availability}
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      {product.description ||
                        "No description available."}
                    </p>

                    <p className="text-sm font-medium mt-3">
                      {product.priceRange ||
                        "Price not specified"}
                    </p>

                  </div>

                )
              )}

            </div>

          </section>

          <section>

            <div className="flex items-center gap-2 mb-3">

              <FileText
                size={18}
                className="text-blue-600"
              />

              <h3 className="font-semibold">
                Internal Notes
              </h3>

            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600">
              {source.internalNotes ||
                "No internal notes."}
            </div>

          </section>

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <Calendar size={16} />

            Last verified:

            <span className="font-medium text-slate-700">
              {source.lastVerifiedDate ||
                "Not verified yet"}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="font-medium mt-1 text-sm">
        {value || "—"}
      </p>

    </div>
  );
}

export default SourceDetails;
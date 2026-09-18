
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { X, Plus, Trash2 } from "lucide-react";
import { db } from "../firebase/firebase.config";

const emptyProduct = {
  name: "",
  description: "",
  priceRange: "",
  availability: "Available",
};

const emptyForm = {
  sourceName: "",
  category: "",
  location: "",
  verificationStatus: "Pending",
  rating: "",
  internalNotes: "",
  lastVerifiedDate: "",
  status: "Active",
  products: [{ ...emptyProduct }],
};

function SourceModal({
  source,
  onClose,
  onSaved,
  showToast,
}) {
  const [form, setForm] = useState({
    ...emptyForm,
    products: [{ ...emptyProduct }],
  });

  const [saving, setSaving] = useState(false);

  // Load source data when editing
  useEffect(() => {
    if (source) {
      setForm({
        sourceName: source.sourceName || "",
        category: source.category || "",
        location: source.location || "",
        verificationStatus:
          source.verificationStatus || "Pending",
        rating:
          source.rating !== undefined
            ? source.rating
            : "",
        internalNotes:
          source.internalNotes || "",
        lastVerifiedDate:
          source.lastVerifiedDate || "",
        status: source.status || "Active",
        products:
          source.products &&
          source.products.length > 0
            ? source.products
            : [{ ...emptyProduct }],
      });
    } else {
      setForm({
        ...emptyForm,
        products: [{ ...emptyProduct }],
      });
    }
  }, [source]);

  // Update main form field
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update product field
  const updateProduct = (
    index,
    field,
    value
  ) => {
    setForm((prev) => {
      const products = [...prev.products];

      products[index] = {
        ...products[index],
        [field]: value,
      };

      return {
        ...prev,
        products,
      };
    });
  };

  // Add new product
  const addProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { ...emptyProduct },
      ],
    }));
  };

  // Remove product
  const removeProduct = (index) => {
    if (form.products.length === 1) {
      showToast(
        "At least one product is required.",
        "error"
      );

      return;
    }

    setForm((prev) => ({
      ...prev,
      products: prev.products.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Save source
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.sourceName.trim()) {
      showToast(
        "Please enter the source name.",
        "error"
      );

      return;
    }

    if (!form.category) {
      showToast(
        "Please select a category.",
        "error"
      );

      return;
    }

    if (form.rating !== "") {
      const rating = Number(form.rating);

      if (
        Number.isNaN(rating) ||
        rating < 0 ||
        rating > 5
      ) {
        showToast(
          "Rating must be between 0 and 5.",
          "error"
        );

        return;
      }
    }

    setSaving(true);

    try {
      const data = {
        sourceName: form.sourceName.trim(),
        category: form.category,
        location: form.location.trim(),
        verificationStatus:
          form.verificationStatus,
        rating:
          form.rating === ""
            ? 0
            : Number(form.rating),
        internalNotes:
          form.internalNotes.trim(),
        lastVerifiedDate:
          form.lastVerifiedDate,
        status: form.status,
        products: form.products.map(
          (product) => ({
            name: product.name?.trim() || "",
            description:
              product.description?.trim() || "",
            priceRange:
              product.priceRange?.trim() || "",
            availability:
              product.availability ||
              "Available",
          })
        ),
      };

      // EDIT SOURCE
      if (source) {
        await updateDoc(
          doc(db, "sources", source.id),
          {
            ...data,
            updatedAt: serverTimestamp(),
          }
        );

        showToast(
          "Source updated successfully.",
          "success"
        );
      }

      // CREATE SOURCE
      else {
        const docRef = await addDoc(
          collection(db, "sources"),
          {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        console.log(
          "Source created successfully:",
          docRef.id
        );

        showToast(
          "Source added successfully.",
          "success"
        );
      }

      // Refresh dashboard
      await onSaved();

      // Close modal
      onClose();
    } catch (error) {
      console.error(
        "Firestore save error:",
        error
      );

      let message =
        "Something went wrong. Please try again.";

      if (
        error.code ===
        "permission-denied"
      ) {
        message =
          "Permission denied. Please check your Firestore rules.";
      }

      if (
        error.code ===
        "unauthenticated"
      ) {
        message =
          "You are not logged in. Please login again.";
      }

      if (
        error.code ===
        "failed-precondition"
      ) {
        message =
          "Firestore is not properly configured.";
      }

      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {source
                ? "Edit Source"
                : "Add New Source"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage source information and
              verification.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center disabled:opacity-50"
          >
            <X size={19} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(92vh-150px)]"
        >

          <div className="p-6 space-y-7">

            {/* Source Information */}

            <section>

              <h3 className="font-semibold text-slate-900 mb-4">
                Source Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">

                <Input
                  label="Source Name"
                  required
                  value={form.sourceName}
                  onChange={(e) =>
                    updateField(
                      "sourceName",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Premium Textile Source"
                />

                <Select
                  label="Category"
                  required
                  value={form.category}
                  onChange={(e) =>
                    updateField(
                      "category",
                      e.target.value
                    )
                  }
                  options={[
                    "Textile",
                    "Electronics",
                    "Food & Beverage",
                    "Agriculture",
                    "Manufacturing",
                    "Packaging",
                    "Services",
                    "Other",
                  ]}
                />

                <Input
                  label="Location"
                  value={form.location}
                  onChange={(e) =>
                    updateField(
                      "location",
                      e.target.value
                    )
                  }
                  placeholder="Dhaka, Bangladesh"
                />

                <Select
                  label="Status"
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value
                    )
                  }
                  options={[
                    "Active",
                    "Archived",
                  ]}
                />

              </div>

            </section>

            {/* Products */}

            <section>

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Product Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    Add products available through
                    this source.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addProduct}
                  disabled={saving}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add Product
                </button>

              </div>

              <div className="space-y-4">

                {form.products.map(
                  (product, index) => (

                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl p-4"
                    >

                      <div className="flex justify-between mb-4">

                        <p className="font-medium text-sm text-slate-900">
                          Product {index + 1}
                        </p>

                        {form.products.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(
                                index
                              )
                            }
                            disabled={saving}
                            className="text-red-500 hover:text-red-600 disabled:opacity-50"
                            title="Remove product"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        )}

                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">

                        <Input
                          label="Product Name"
                          value={
                            product.name
                          }
                          onChange={(e) =>
                            updateProduct(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Cotton Fabric"
                        />

                        <Input
                          label="Price Range"
                          value={
                            product.priceRange
                          }
                          onChange={(e) =>
                            updateProduct(
                              index,
                              "priceRange",
                              e.target.value
                            )
                          }
                          placeholder="৳250 - ৳500"
                        />

                        <Input
                          label="Description"
                          value={
                            product.description
                          }
                          onChange={(e) =>
                            updateProduct(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Product description"
                        />

                        <Select
                          label="Availability"
                          value={
                            product.availability
                          }
                          onChange={(e) =>
                            updateProduct(
                              index,
                              "availability",
                              e.target.value
                            )
                          }
                          options={[
                            "Available",
                            "Limited",
                            "Out of Stock",
                          ]}
                        />

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* Verification */}

            <section>

              <h3 className="font-semibold text-slate-900 mb-4">
                Verification
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">

                <Select
                  label="Verification Status"
                  value={
                    form.verificationStatus
                  }
                  onChange={(e) =>
                    updateField(
                      "verificationStatus",
                      e.target.value
                    )
                  }
                  options={[
                    "Pending",
                    "Verified",
                    "Rejected",
                  ]}
                />

                <Input
                  label="Source Rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) =>
                    updateField(
                      "rating",
                      e.target.value
                    )
                  }
                  placeholder="4.5"
                />

                <Input
                  label="Last Verified"
                  type="date"
                  value={
                    form.lastVerifiedDate
                  }
                  onChange={(e) =>
                    updateField(
                      "lastVerifiedDate",
                      e.target.value
                    )
                  }
                />

              </div>

            </section>

            {/* Internal Notes */}

            <section>

              <h3 className="font-semibold text-slate-900 mb-4">
                Internal Notes
              </h3>

              <textarea
                rows="4"
                value={form.internalNotes}
                onChange={(e) =>
                  updateField(
                    "internalNotes",
                    e.target.value
                  )
                }
                placeholder="Add internal information about this source..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </section>

          </div>

          {/* Footer */}

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving
                ? "Saving..."
                : source
                ? "Update Source"
                : "Create Source"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

/* Input Component */

function Input({
  label,
  required,
  ...props
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      <input
        {...props}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />

    </div>
  );
}

/* Select Component */

function Select({
  label,
  required,
  options,
  ...props
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      <select
        {...props}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

export default SourceModal;

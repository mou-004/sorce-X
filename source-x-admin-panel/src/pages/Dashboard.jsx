import { useEffect, useMemo, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import {
  Archive,
  CheckCircle,
  Clock3,
  Database,
  Edit3,
  Eye,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";

import { db } from "../firebase/firebase.config";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import SourceModal from "../components/SourceModal";
import SourceDetails from "../components/SourceDetails";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

function Dashboard({ user }) {

  const [sources, setSources] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [showModal, setShowModal] =
    useState(false);

  const [editingSource, setEditingSource] =
    useState(null);

  const [viewingSource, setViewingSource] =
    useState(null);

  const [confirm, setConfirm] =
    useState(null);

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All");

  const [verification, setVerification] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const loadSources = async () => {

    setLoading(true);

    try {

      const snapshot = await getDocs(
        collection(db, "sources")
      );

      const data = snapshot.docs.map(
        (item) => ({
          id: item.id,
          ...item.data(),
        })
      );

      setSources(data);

    } catch (error) {

      showToast(
        "Could not load sources.",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const total = sources.length;

  const verified = sources.filter(
    (item) =>
      item.verificationStatus ===
      "Verified"
  ).length;

  const pending = sources.filter(
    (item) =>
      item.verificationStatus ===
      "Pending"
  ).length;

  const archived = sources.filter(
    (item) =>
      item.status === "Archived"
  ).length;

  const categories = useMemo(() => {

    const values = sources
      .map((item) => item.category)
      .filter(Boolean);

    return [
      "All",
      ...new Set(values),
    ];

  }, [sources]);

  const filteredSources = sources.filter(
    (source) => {

      const searchMatch =
        source.sourceName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        source.location
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        source.category
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const categoryMatch =
        category === "All" ||
        source.category === category;

      const verificationMatch =
        verification === "All" ||
        source.verificationStatus ===
          verification;

      const statusMatch =
        status === "All" ||
        source.status === status;

      return (
        searchMatch &&
        categoryMatch &&
        verificationMatch &&
        statusMatch
      );
    }
  );

  const handleArchive = (source) => {

    setConfirm({
      title: "Archive source?",
      message:
        `Are you sure you want to archive "${source.sourceName}"?`,
      confirmText: "Archive",
      action: async () => {

        await updateDoc(
          doc(db, "sources", source.id),
          {
            status: "Archived",
          }
        );

        showToast(
          "Source archived successfully."
        );

        await loadSources();
      },
    });
  };

  const handleRestore = (source) => {

    setConfirm({
      title: "Restore source?",
      message:
        `Restore "${source.sourceName}" to the active source list?`,
      confirmText: "Restore",
      action: async () => {

        await updateDoc(
          doc(db, "sources", source.id),
          {
            status: "Active",
          }
        );

        showToast(
          "Source restored successfully."
        );

        await loadSources();
      },
    });
  };

  const handleDelete = (source) => {

    setConfirm({
      title: "Delete source permanently?",
      message:
        "This action cannot be undone. The source and its stored information will be permanently removed.",
      confirmText: "Delete",
      action: async () => {

        await deleteDoc(
          doc(db, "sources", source.id)
        );

        showToast(
          "Source deleted permanently."
        );

        await loadSources();
      },
    });
  };

  const openCreate = () => {
    setEditingSource(null);
    setShowModal(true);
  };

  const openEdit = (source) => {
    setEditingSource(source);
    setShowModal(true);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setVerification("All");
    setStatus("All");
  };

  return (
    <>
      <Layout
        user={user}
        activePage={activePage}
        setActivePage={setActivePage}
      >

        {/* Page heading */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

          <div>

            <p className="text-sm text-blue-600 font-semibold">
              Source X / {activePage}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              {activePage === "Dashboard"
                ? "Source Management"
                : activePage}
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Manage, verify and organize your sourcing network.
            </p>

          </div>

          <button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            <Plus size={18} />
            Add Source
          </button>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

          <StatCard
            title="Total Sources"
            value={total}
            description="All registered sources"
            icon={<Database size={21} />}
          />

          <StatCard
            title="Verified Sources"
            value={verified}
            description="Successfully verified"
            icon={<CheckCircle size={21} />}
          />

          <StatCard
            title="Pending Review"
            value={pending}
            description="Require verification"
            icon={<Clock3 size={21} />}
          />

          <StatCard
            title="Archived"
            value={archived}
            description="Inactive sources"
            icon={<Archive size={21} />}
          />

        </div>

        {/* Sources */}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {/* Toolbar */}

          <div className="p-5 border-b border-slate-200">

            <div className="flex flex-col xl:flex-row xl:items-center gap-4">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-3.5 top-3.5 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by source, category or location..."
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

              </div>

              <div className="flex flex-wrap gap-2">

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="border border-slate-200 rounded-xl px-3 py-3 bg-white text-sm outline-none"
                >

                  {categories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item === "All"
                        ? "All Categories"
                        : item}
                    </option>
                  ))}

                </select>

                <select
                  value={verification}
                  onChange={(e) =>
                    setVerification(
                      e.target.value
                    )
                  }
                  className="border border-slate-200 rounded-xl px-3 py-3 bg-white text-sm outline-none"
                >

                  <option value="All">
                    All Verification
                  </option>

                  <option value="Verified">
                    Verified
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                </select>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="border border-slate-200 rounded-xl px-3 py-3 bg-white text-sm outline-none"
                >

                  <option value="All">
                    All Status
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Archived">
                    Archived
                  </option>

                </select>

              </div>

            </div>

            {(search ||
              category !== "All" ||
              verification !== "All" ||
              status !== "All") && (

              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 font-medium mt-3 flex items-center gap-1"
              >
                <XCircle size={14} />
                Clear filters
              </button>

            )}

          </div>

          {/* Table */}

          <div className="overflow-x-auto">

            {loading ? (

              <div className="py-20 text-center">

                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                <p className="text-sm text-slate-500 mt-4">
                  Loading sources...
                </p>

              </div>

            ) : filteredSources.length === 0 ? (

              <div className="py-20 text-center px-5">

                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">

                  <Database
                    size={25}
                    className="text-slate-400"
                  />

                </div>

                <h3 className="font-semibold mt-4">
                  No sources found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try changing your filters or add a new source.
                </p>

                <button
                  onClick={openCreate}
                  className="mt-5 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium"
                >
                  Add Source
                </button>

              </div>

            ) : (

              <table className="w-full text-sm">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr className="text-left text-slate-500">

                    <th className="px-5 py-4 font-medium">
                      Source
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Category
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Location
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Verification
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Rating
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredSources.map(
                    (source) => (

                      <tr
                        key={source.id}
                        className="hover:bg-slate-50 transition"
                      >

                        <td className="px-5 py-4">

                          <div className="font-semibold text-slate-900">
                            {source.sourceName}
                          </div>

                          <div className="text-xs text-slate-400 mt-1">
                            {source.products?.length ||
                              0}{" "}
                            product(s)
                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                            {source.category ||
                              "—"}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-slate-600">

                            <MapPin size={15} />

                            {source.location ||
                              "—"}

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <Status
                            status={
                              source.verificationStatus
                            }
                          />

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1">

                            <Star
                              size={15}
                              className="text-yellow-500 fill-yellow-500"
                            />

                            <span className="font-medium">
                              {source.rating ||
                                "0.0"}
                            </span>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <Status
                            status={
                              source.status
                            }
                          />

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-1">

                            <ActionButton
                              title="View"
                              onClick={() =>
                                setViewingSource(
                                  source
                                )
                              }
                            >
                              <Eye size={16} />
                            </ActionButton>

                            <ActionButton
                              title="Edit"
                              onClick={() =>
                                openEdit(source)
                              }
                            >
                              <Edit3 size={16} />
                            </ActionButton>

                            {source.status ===
                            "Archived" ? (

                              <ActionButton
                                title="Restore"
                                onClick={() =>
                                  handleRestore(
                                    source
                                  )
                                }
                              >
                                <RotateCcw
                                  size={16}
                                />
                              </ActionButton>

                            ) : (

                              <ActionButton
                                title="Archive"
                                onClick={() =>
                                  handleArchive(
                                    source
                                  )
                                }
                              >
                                <Archive
                                  size={16}
                                />
                              </ActionButton>

                            )}

                            <ActionButton
                              title="Delete"
                              danger
                              onClick={() =>
                                handleDelete(
                                  source
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </ActionButton>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

          {/* Footer */}

          {!loading &&
            filteredSources.length > 0 && (

              <div className="px-5 py-4 border-t border-slate-200 text-xs text-slate-500">

                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredSources.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {sources.length}
                </span>{" "}
                sources

              </div>

            )}

        </div>

      </Layout>

      {showModal && (
        <SourceModal
          source={editingSource}
          onClose={() =>
            setShowModal(false)
          }
          onSaved={loadSources}
          showToast={showToast}
        />
      )}

      {viewingSource && (
        <SourceDetails
          source={viewingSource}
          onClose={() =>
            setViewingSource(null)
          }
        />
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmText={confirm.confirmText}
          onClose={() =>
            setConfirm(null)
          }
          onConfirm={async () => {

            try {
              await confirm.action();
              setConfirm(null);
            } catch {
              showToast(
                "Action failed. Please try again.",
                "error"
              );
            }

          }}
        />
      )}

      <Toast
        toast={toast}
        onClose={() =>
          setToast(null)
        }
      />

    </>
  );
}

function Status({ status }) {

  let style =
    "bg-slate-100 text-slate-600";

  if (
    status === "Verified" ||
    status === "Active"
  ) {
    style =
      "bg-emerald-50 text-emerald-700 border border-emerald-100";
  }

  if (status === "Pending") {
    style =
      "bg-amber-50 text-amber-700 border border-amber-100";
  }

  if (
    status === "Rejected" ||
    status === "Archived"
  ) {
    style =
      "bg-red-50 text-red-700 border border-red-100";
  }

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {status || "—"}
    </span>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  danger,
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
        danger
          ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
          : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      {children}
    </button>
  );
}

export default Dashboard;
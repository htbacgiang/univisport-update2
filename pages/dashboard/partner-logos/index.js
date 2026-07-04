import { getSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import axios from "axios";
import AdminLayout from "../../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Users,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Save,
  RefreshCw,
  X,
  Pencil,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

const emptyForm = { name: "", logo: "", link: "" };

export default function PartnerLogosPage() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/partner-logos");
      setLogos(data.logos.map((l) => ({ ...l, id: l._id })));
    } catch {
      toast.error("Không thể tải danh sách logo");
    } finally {
      setLoading(false);
    }
  };

  const handleSortEnd = (newList) => {
    setLogos(newList);
    setOrderChanged(true);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      await axios.put("/api/partner-logos?action=reorder", {
        orderedIds: logos.map((l) => l._id || l.id),
      });
      setOrderChanged(false);
      toast.success("Đã lưu thứ tự hiển thị");
    } catch {
      toast.error("Lưu thứ tự thất bại");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (item) => {
    const prev = logos;
    setLogos((s) =>
      s.map((l) => (l._id === item._id ? { ...l, isVisible: !l.isVisible } : l))
    );
    try {
      await axios.put(`/api/partner-logos?id=${item._id}`, {
        isVisible: !item.isVisible,
      });
      toast.success(item.isVisible ? "Đã ẩn logo" : "Đã hiện logo");
    } catch {
      setLogos(prev);
      toast.error("Cập nhật thất bại");
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditTarget(item);
    setForm({ name: item.name, logo: item.logo, link: item.link || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(emptyForm);
    if (modalFileInputRef.current) modalFileInputRef.current.value = "";
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post("/api/upload", formData);
      if (data.links?.[0]) {
        setForm((f) => ({ ...f, logo: data.links[0] }));
        toast.success("Đã tải logo lên");
      }
    } catch {
      toast.error("Tải ảnh thất bại");
    } finally {
      setUploading(false);
      if (modalFileInputRef.current) modalFileInputRef.current.value = "";
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.logo.trim()) {
      toast.error("Vui lòng điền tên và logo");
      return;
    }
    setSaving(true);
    try {
      if (editTarget) {
        const { data } = await axios.put(
          `/api/partner-logos?id=${editTarget._id}`,
          form
        );
        setLogos((s) =>
          s.map((l) =>
            l._id === editTarget._id
              ? { ...data.logo, id: data.logo._id }
              : l
          )
        );
        toast.success("Đã cập nhật logo");
      } else {
        const { data } = await axios.post("/api/partner-logos", form);
        setLogos((s) => [...s, { ...data.logo, id: data.logo._id }]);
        toast.success("Đã thêm logo mới");
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.err || "Lỗi xử lý");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await axios.delete(`/api/partner-logos?id=${deleteConfirm._id}`);
      setLogos((s) => s.filter((l) => l._id !== deleteConfirm._id));
      toast.success("Đã xóa logo");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const seedDefaults = async () => {
    setSaving(true);
    try {
      const { data } = await axios.post("/api/partner-logos", { action: "seed" });
      setLogos(data.logos.map((l) => ({ ...l, id: l._id })));
      toast.success("Đã khởi tạo logos mặc định");
    } catch (err) {
      toast.error(err.response?.data?.err || "Khởi tạo thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Quản lý Logo Đối Tác">
      <div className="p-6 bg-[#f8fafc] min-h-screen space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#105d97] shrink-0" />
            <h1 className="text-[1.375rem] font-bold text-[#0f172a] m-0">
              Logo Đối Tác
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {orderChanged && (
              <button
                onClick={saveOrder}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#105d97] text-white text-sm font-medium rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Đang lưu..." : "Lưu thứ tự"}
              </button>
            )}
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-sm font-medium rounded-lg hover:bg-[#15803d] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm Logo
            </button>
          </div>
        </div>

        {/* Guide note */}
        <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <GripVertical className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Kéo thả để sắp xếp thứ tự hiển thị. Bấm{" "}
            <strong>Lưu thứ tự</strong> sau khi sắp xếp xong. Logo ẩn sẽ không hiển
            thị trên trang chủ.
          </span>
        </div>

        {/* Logo grid / list */}
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[32px_80px_1fr_160px_80px_100px] gap-3 items-center px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
            <span />
            <span>Logo</span>
            <span>Tên đối tác</span>
            <span>Link</span>
            <span className="text-center">Hiện</span>
            <span className="text-center">Thao tác</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <RefreshCw className="w-6 h-6 text-[#105d97] animate-spin" />
            </div>
          ) : logos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-[#64748b]">
              <Users className="w-12 h-12 text-[#cbd5e1]" />
              <p className="text-sm">
                Chưa có logo nào. Bấm khởi tạo mặc định hoặc thêm mới.
              </p>
              <button
                onClick={seedDefaults}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#105d97] text-white text-sm font-medium rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Khởi tạo Logos Mặc Định
              </button>
            </div>
          ) : (
            <ReactSortable
              list={logos}
              setList={handleSortEnd}
              handle=".drag-handle"
              animation={150}
            >
              {logos.map((item) => (
                <div
                  key={item._id || item.id}
                  className={`grid grid-cols-[32px_80px_1fr_160px_80px_100px] gap-3 items-center px-4 py-3 border-b border-[#f1f5f9] last:border-0 transition-colors ${
                    !item.isVisible
                      ? "opacity-50 bg-gray-50"
                      : "hover:bg-[#f8fafc]"
                  }`}
                >
                  {/* Drag handle */}
                  <div className="drag-handle cursor-grab active:cursor-grabbing text-[#94a3b8] hover:text-[#64748b] flex justify-center">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Logo preview */}
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-10 relative rounded-md overflow-hidden border border-[#e2e8f0] bg-gray-50 flex items-center justify-center">
                      {item.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-[#cbd5e1]" />
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <p className="text-sm font-semibold text-[#0f172a] truncate">
                    {item.name}
                  </p>

                  {/* Link */}
                  <p className="text-xs text-[#64748b] truncate">
                    {item.link || <span className="text-[#cbd5e1]">—</span>}
                  </p>

                  {/* Visibility toggle */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggleVisible(item)}
                      title={item.isVisible ? "Ẩn logo" : "Hiện logo"}
                      className={`p-2 rounded-lg transition-colors ${
                        item.isVisible
                          ? "text-[#16a34a] hover:bg-green-50"
                          : "text-[#94a3b8] hover:bg-gray-100"
                      }`}
                    >
                      {item.isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      title="Chỉnh sửa"
                      className="p-2 rounded-lg text-[#105d97] hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      title="Xóa logo"
                      className="p-2 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          )}
        </div>

        {/* Summary */}
        {logos.length > 0 && (
          <p className="text-xs text-[#94a3b8] text-right">
            {logos.filter((l) => l.isVisible).length}/{logos.length} logo đang
            hiển thị
          </p>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-base font-bold text-[#0f172a]">
                {editTarget ? "Chỉnh sửa Logo" : "Thêm Logo Mới"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[#64748b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitForm} className="px-6 py-5 space-y-4">
              {/* Logo upload / preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#374151]">
                  Logo *
                </label>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                />

                {form.logo ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-gray-50 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.logo}
                      alt="Logo preview"
                      className="w-full h-28 object-contain mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => modalFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-xs font-medium rounded-lg shadow text-[#374151] hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" /> Đổi ảnh
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, logo: "" }))}
                        className="px-3 py-1.5 bg-white text-xs font-medium rounded-lg shadow text-red-500 hover:bg-red-50 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Xóa
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-24 border-2 border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center gap-1.5 text-[#94a3b8] hover:border-[#105d97] hover:text-[#105d97] transition-colors disabled:opacity-60"
                  >
                    {uploading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span className="text-xs font-medium">
                          Bấm để tải ảnh lên
                        </span>
                        <span className="text-[10px]">
                          JPG, PNG, WebP, SVG
                        </span>
                      </>
                    )}
                  </button>
                )}

                {/* URL input */}
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] text-[#94a3b8] shrink-0">
                    hoặc URL:
                  </span>
                  <input
                    value={form.logo}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, logo: e.target.value }))
                    }
                    placeholder="https://... hoặc /khach-hang/1.png"
                    className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                  />
                  {form.logo && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, logo: "" }))}
                      className="p-1.5 text-[#94a3b8] hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151]">
                  Tên đối tác *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="VD: Công ty ABC"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                />
              </div>

              {/* Link */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#374151] flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> Link khi click (tùy chọn)
                </label>
                <input
                  value={form.link}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, link: e.target.value }))
                  }
                  placeholder="https://... hoặc để trống"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-[#64748b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#105d97] rounded-lg hover:bg-[#0d4a7a] disabled:opacity-60 transition-colors"
                >
                  {saving ? "Đang lưu..." : editTarget ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Xác nhận xóa</h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Logo <strong>{deleteConfirm.name}</strong> sẽ bị xóa vĩnh viễn.
                </p>
              </div>
            </div>

            {deleteConfirm.logo && (
              <div className="flex justify-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={deleteConfirm.logo}
                  alt={deleteConfirm.name}
                  className="h-16 object-contain mix-blend-multiply"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-[#64748b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user?.role !== "admin") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}

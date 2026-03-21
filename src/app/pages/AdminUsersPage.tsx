import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { AdminSidebar } from "../components/AdminSidebar";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#737373" strokeWidth="1.5" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="3,6 5,6 21,6" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6l-1 14H6L5 6" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ dir = "down" }: { dir?: "up" | "down" | "left" | "right" }) {
  const rot = { down: 0, up: 180, right: -90, left: 90 }[dir];
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rot}deg)`, transition: "transform 0.2s" }}>
      <polyline points="6,9 12,15 18,9" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="11" x2="22" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="19" y1="12" x2="5" y2="12" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="11,6 5,12 11,18" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────���───────────────────────────────

type Role   = "Admin" | "Editor" | "Customer";
type Status = "Active" | "Inactive";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: Status;
  joined: string;   // ISO date string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_USERS: User[] = [
  { id: 1,  firstName: "Amelia",   lastName: "Chen",      email: "amelia.chen@everlane.com",   role: "Admin",    status: "Active",   joined: "2022-03-12" },
  { id: 2,  firstName: "Marcus",   lastName: "Rivera",    email: "m.rivera@everlane.com",       role: "Editor",   status: "Active",   joined: "2022-07-04" },
  { id: 3,  firstName: "Sophie",   lastName: "Nguyen",    email: "sophie.n@everlane.com",       role: "Customer", status: "Active",   joined: "2023-01-19" },
  { id: 4,  firstName: "Jordan",   lastName: "Kim",       email: "j.kim@everlane.com",          role: "Editor",   status: "Inactive", joined: "2022-11-30" },
  { id: 5,  firstName: "Priya",    lastName: "Patel",     email: "priya.patel@everlane.com",    role: "Customer", status: "Active",   joined: "2023-05-08" },
  { id: 6,  firstName: "Ethan",    lastName: "Brooks",    email: "e.brooks@everlane.com",       role: "Customer", status: "Active",   joined: "2023-09-14" },
  { id: 7,  firstName: "Isabelle", lastName: "Moreau",    email: "i.moreau@everlane.com",       role: "Admin",    status: "Active",   joined: "2021-06-22" },
  { id: 8,  firstName: "Devon",    lastName: "Walsh",     email: "d.walsh@everlane.com",        role: "Customer", status: "Inactive", joined: "2024-02-01" },
  { id: 9,  firstName: "Nadia",    lastName: "Okonkwo",   email: "n.okonkwo@everlane.com",      role: "Editor",   status: "Active",   joined: "2023-12-11" },
  { id: 10, firstName: "Lucas",    lastName: "Hartmann",  email: "l.hartmann@everlane.com",     role: "Customer", status: "Active",   joined: "2024-04-27" },
];

const ROLES: Role[]     = ["Admin", "Editor", "Customer"];
const STATUSES: Status[] = ["Active", "Inactive"];

let nextId = INITIAL_USERS.length + 1;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(u: User) {
  return (u.firstName[0] + u.lastName[0]).toUpperCase();
}

function avatarColor(id: number) {
  const palette = ["#2d3a4a", "#4a3728", "#2e4a3a", "#3a2d4a", "#4a4428", "#28404a"];
  return palette[id % palette.length];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  const styles: Record<Role, React.CSSProperties> = {
    Admin:    { background: "#1a1a1a", color: "#fff" },
    Editor:   { background: "#f5f4f4", color: "#262626", border: "1px solid #dddbdc" },
    Customer: { background: "#f5f4f4", color: "#737373", border: "1px solid #dddbdc" },
  };
  return (
    <span style={{
      ...styles[role],
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", fontSize: 10, letterSpacing: "0.6px",
      textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      {role === "Admin" && <ShieldIcon />}
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, letterSpacing: "0.4px", color: status === "Active" ? "#2a7a3b" : "#737373",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: status === "Active" ? "#2a7a3b" : "#b0aeae", flexShrink: 0,
      }} />
      {status}
    </span>
  );
}

// ─── Form modal ───────────────────────────────────────────────────────────────

interface FormErrors { firstName?: string; lastName?: string; email?: string; role?: string; }

interface UserFormProps {
  initial?: User | null;
  onSave: (data: Omit<User, "id" | "joined">) => void;
  onClose: () => void;
}

function UserFormModal({ initial, onSave, onClose }: UserFormProps) {
  const isEdit = !!initial;
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName,  setLastName]  = useState(initial?.lastName  ?? "");
  const [email,     setEmail]     = useState(initial?.email     ?? "");
  const [role,      setRole]      = useState<Role>(initial?.role ?? "Customer");
  const [status,    setStatus]    = useState<Status>(initial?.status ?? "Active");
  const [errors,    setErrors]    = useState<FormErrors>({});
  const [focused,   setFocused]   = useState<string | null>(null);

  function validate() {
    const e: FormErrors = {};
    if (!firstName.trim()) e.firstName = "Required.";
    if (!lastName.trim())  e.lastName  = "Required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ firstName, lastName, email, role, status });
  }

  function field(
    id: string, label: string, value: string, onChange: (v: string) => void,
    type = "text", error?: string
  ) {
    return (
      <div className="admin-form__field">
        <label className="admin-form__label" htmlFor={id}>{label}</label>
        <input
          id={id}
          className="admin-form__input"
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          style={{ borderColor: error ? "#d0021b" : focused === id ? "#262626" : "#dddbdc" }}
          autoComplete="off"
        />
        {error && <p className="admin-form__error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal__head">
          <p className="admin-modal__title">{isEdit ? "Edit User" : "New User"}</p>
          <button className="admin-modal__close" onClick={onClose}><CloseIcon /></button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-form__row">
            {field("adm-fn", "FIRST NAME", firstName, setFirstName, "text", errors.firstName)}
            {field("adm-ln", "LAST NAME",  lastName,  setLastName,  "text", errors.lastName)}
          </div>
          {field("adm-em", "EMAIL ADDRESS", email, setEmail, "email", errors.email)}

          {/* Role */}
          <div className="admin-form__field">
            <label className="admin-form__label">ROLE</label>
            <div className="admin-form__select-wrap" style={{ borderColor: "#dddbdc" }}>
              <select
                className="admin-form__select"
                value={role}
                onChange={e => setRole(e.target.value as Role)}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span style={{ pointerEvents: "none", position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                <ChevronIcon dir="down" />
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="admin-form__field">
            <label className="admin-form__label">STATUS</label>
            <div className="admin-form__radios">
              {STATUSES.map(s => (
                <label key={s} className="admin-form__radio-label">
                  <span
                    className="admin-form__radio-box"
                    style={{ borderColor: status === s ? "#262626" : "#dddbdc" }}
                    onClick={() => setStatus(s)}
                  >
                    {status === s && <span className="admin-form__radio-dot" />}
                  </span>
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--dark">
              {isEdit ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteModal({ user, onConfirm, onClose }: { user: User; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="admin-modal__head">
          <p className="admin-modal__title">Delete User</p>
          <button className="admin-modal__close" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="admin-modal__body">
          <p className="admin-delete__msg">
            Are you sure you want to delete{" "}
            <strong>{user.firstName} {user.lastName}</strong>?
            This action cannot be undone.
          </p>
        </div>
        <div className="admin-modal__actions">
          <button className="admin-btn admin-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 6;

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [users,        setUsers]        = useState<User[]>(INITIAL_USERS);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [sortBy,       setSortBy]       = useState<"name" | "joined" | "role">("joined");
  const [sortDir,      setSortDir]      = useState<"asc" | "desc">("desc");
  const [page,         setPage]         = useState(1);
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [toast,        setToast]        = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  // Filter + sort
  const filtered = useMemo(() => {
    let list = users.filter(u => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || u.firstName.toLowerCase().includes(q)
        || u.lastName.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q);
      const matchRole   = roleFilter   === "All" || u.role   === roleFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name")   cmp = (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
      if (sortBy === "joined") cmp = a.joined.localeCompare(b.joined);
      if (sortBy === "role")   cmp = a.role.localeCompare(b.role);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [users, search, roleFilter, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(col: "name" | "joined" | "role") {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
    setPage(1);
  }

  function handleCreate(data: Omit<User, "id" | "joined">) {
    const newUser: User = { ...data, id: nextId++, joined: new Date().toISOString().slice(0, 10) };
    setUsers(prev => [newUser, ...prev]);
    setShowForm(false);
    showToast("User created successfully.");
    setPage(1);
  }

  function handleEdit(data: Omit<User, "id" | "joined">) {
    setUsers(prev => prev.map(u => u.id === editTarget!.id ? { ...u, ...data } : u));
    setEditTarget(null);
    showToast("User updated successfully.");
  }

  function handleDelete() {
    setUsers(prev => prev.filter(u => u.id !== deleteTarget!.id));
    setDeleteTarget(null);
    showToast("User deleted.");
    if (paginated.length === 1 && page > 1) setPage(p => p - 1);
  }

  function SortTh({ col, label }: { col: "name" | "joined" | "role"; label: string }) {
    const active = sortBy === col;
    return (
      <th
        className="admin-table__th admin-table__th--sortable"
        onClick={() => handleSort(col)}
        style={{ color: active ? "#262626" : "#737373" }}
      >
        {label}
        <span style={{ marginLeft: 4, opacity: active ? 1 : 0.4 }}>
          <ChevronIcon dir={active && sortDir === "asc" ? "up" : "down"} />
        </span>
      </th>
    );
  }

  const activeCount   = users.filter(u => u.status === "Active").length;
  const adminCount    = users.filter(u => u.role === "Admin").length;

  return (
    <div className="admin-page">
      {/* ── Sidebar ── */}
      <AdminSidebar activeItem="users" />

      {/* ── Main content ── */}
      <main className="admin-main">
        {/* Page header */}
        <div className="admin-topbar">
          <div>
            <p className="admin-topbar__title">User Management</p>
            <p className="admin-topbar__sub">{users.length} total · {activeCount} active · {adminCount} admins</p>
          </div>
          <button className="admin-btn admin-btn--dark admin-btn--icon" onClick={() => { setEditTarget(null); setShowForm(true); }}>
            <UserPlusIcon />
            New User
          </button>
        </div>

        {/* Stats strip */}
        <div className="admin-stats">
          {[
            { label: "Total Users",    value: users.length },
            { label: "Active",         value: users.filter(u => u.status === "Active").length },
            { label: "Admins",         value: users.filter(u => u.role === "Admin").length },
            { label: "Editors",        value: users.filter(u => u.role === "Editor").length },
            { label: "Customers",      value: users.filter(u => u.role === "Customer").length },
            { label: "Inactive",       value: users.filter(u => u.status === "Inactive").length },
          ].map(s => (
            <div key={s.label} className="admin-stat">
              <p className="admin-stat__value">{s.value}</p>
              <p className="admin-stat__label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar: search + filters */}
        <div className="admin-toolbar">
          <div className="admin-search">
            <span className="admin-search__icon"><SearchIcon /></span>
            <input
              className="admin-search__input"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="admin-filters">
            {/* Role filter */}
            <div className="admin-filter-select-wrap">
              <select
                className="admin-filter-select"
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value as Role | "All"); setPage(1); }}
              >
                <option value="All">All Roles</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span className="admin-filter-chevron"><ChevronIcon dir="down" /></span>
            </div>

            {/* Status filter */}
            <div className="admin-filter-select-wrap">
              <select
                className="admin-filter-select"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value as Status | "All"); setPage(1); }}
              >
                <option value="All">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="admin-filter-chevron"><ChevronIcon dir="down" /></span>
            </div>

            {/* Clear */}
            {(search || roleFilter !== "All" || statusFilter !== "All") && (
              <button
                className="admin-btn admin-btn--ghost"
                onClick={() => { setSearch(""); setRoleFilter("All"); setStatusFilter("All"); setPage(1); }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <SortTh col="name"   label="User" />
                <th className="admin-table__th">Email</th>
                <SortTh col="role"   label="Role" />
                <th className="admin-table__th">Status</th>
                <SortTh col="joined" label="Joined" />
                <th className="admin-table__th admin-table__th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-table__empty">
                    No users match your filters.
                  </td>
                </tr>
              ) : paginated.map(u => (
                <tr key={u.id} className="admin-table__row">
                  {/* User */}
                  <td className="admin-table__td">
                    <div className="admin-user-cell">
                      <div className="admin-avatar" style={{ background: avatarColor(u.id) }}>
                        {initials(u)}
                      </div>
                      <span className="admin-user-cell__name">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="admin-table__td admin-table__td--muted">{u.email}</td>
                  {/* Role */}
                  <td className="admin-table__td"><RoleBadge role={u.role} /></td>
                  {/* Status */}
                  <td className="admin-table__td"><StatusBadge status={u.status} /></td>
                  {/* Joined */}
                  <td className="admin-table__td admin-table__td--muted">{fmtDate(u.joined)}</td>
                  {/* Actions */}
                  <td className="admin-table__td admin-table__td--actions">
                    <button
                      className="admin-action-btn"
                      title="Edit"
                      onClick={() => { setEditTarget(u); setShowForm(true); }}
                    >
                      <EditIcon /> Edit
                    </button>
                    <button
                      className="admin-action-btn admin-action-btn--danger"
                      title="Delete"
                      onClick={() => setDeleteTarget(u)}
                    >
                      <TrashIcon /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="admin-pagination">
          <p className="admin-pagination__info">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="admin-pagination__btns">
            <button
              className="admin-pagination__btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`admin-pagination__btn${n === page ? " admin-pagination__btn--active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="admin-pagination__btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </main>

      {/* ── Modals ── */}
      {showForm && (
        <UserFormModal
          initial={editTarget}
          onSave={editTarget ? handleEdit : handleCreate}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="admin-toast">
          <span className="admin-toast__dot" />
          {toast}
        </div>
      )}
    </div>
  );
}
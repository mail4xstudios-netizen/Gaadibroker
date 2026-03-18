"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "seller" | "admin";
  emailVerified: boolean;
  phoneVerified: boolean;
  blocked: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  loginCount: number;
  city?: string;
  createdAt: string;
}

interface LoginRecord {
  userId: string;
  ip: string;
  userAgent: string;
  method: string;
  success: boolean;
  timestamp: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "blocked" | "verified">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchUsers = () => {
    adminFetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { if (data.users) setUsers(data.users); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (user: User) => {
    const action = user.blocked ? "unblock" : "block";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} user "${user.name}"?`)) return;
    try {
      await adminFetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, blocked: !user.blocked }),
      });
      fetchUsers();
    } catch {
      alert("Failed to update user");
    }
  };

  const changeRole = async (userId: string, role: string) => {
    try {
      await adminFetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role }),
      });
      fetchUsers();
    } catch {
      alert("Failed to update role");
    }
  };

  const deleteUser = async (user: User) => {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    try {
      await adminFetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      if (selectedUser?.id === user.id) setSelectedUser(null);
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  const viewHistory = async (user: User) => {
    setSelectedUser(user);
    setHistoryLoading(true);
    try {
      const res = await adminFetch(`/api/admin/login-history?userId=${user.id}`);
      const data = await res.json();
      setLoginHistory(data.history || []);
    } catch {
      setLoginHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Role", "Email Verified", "Blocked", "Login Count", "Last Login", "City", "Created"];
    const rows = filteredUsers.map((u) => [
      u.name, u.email, u.phone, u.role,
      u.emailVerified ? "Yes" : "No",
      u.blocked ? "Yes" : "No",
      u.loginCount,
      u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never",
      u.city || "",
      new Date(u.createdAt).toLocaleString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "blocked" && !u.blocked) return false;
    if (filter === "verified" && !u.emailVerified) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
    }
    return true;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} total users</p>
        </div>
        <button onClick={exportCSV} className="btn-outline text-sm flex items-center gap-2 self-start">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex gap-2">
          {(["all", "verified", "blocked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={users.length} color="blue" />
        <StatCard label="Verified" value={users.filter((u) => u.emailVerified).length} color="green" />
        <StatCard label="Blocked" value={users.filter((u) => u.blocked).length} color="red" />
        <StatCard label="Active Today" value={users.filter((u) => {
          if (!u.lastLoginAt) return false;
          const d = new Date(u.lastLoginAt);
          const today = new Date();
          return d.toDateString() === today.toDateString();
        }).length} color="orange" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Users Table */}
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Last Login</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50 ${selectedUser?.id === user.id ? "bg-orange-50" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.blocked ? "bg-red-400" : "bg-orange-500"}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          user.role === "admin" ? "bg-purple-100 text-purple-700" :
                          user.role === "seller" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>{user.role}</span>
                        {user.emailVerified && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">verified</span>
                        )}
                        {user.blocked && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">blocked</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-xs text-gray-500">
                        {user.lastLoginAt ? (
                          <>
                            <p>{new Date(user.lastLoginAt).toLocaleDateString()}</p>
                            <p className="text-gray-400">{user.lastLoginDevice} &bull; {user.loginCount} logins</p>
                          </>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => viewHistory(user)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleBlock(user)}
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            user.blocked
                              ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                              : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                          }`}
                        >
                          {user.blocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => deleteUser(user)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {search || filter !== "all" ? "No users match your filters" : "No users registered yet"}
            </div>
          )}
        </div>

        {/* User Detail Panel */}
        {selectedUser && (
          <div className="w-full lg:w-80 bg-white rounded-xl shadow-md p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="text-center mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 ${selectedUser.blocked ? "bg-red-400" : "bg-orange-500"}`}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-gray-900">{selectedUser.name}</p>
              <p className="text-xs text-gray-500">{selectedUser.email}</p>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow label="Phone" value={selectedUser.phone || "Not provided"} />
              <DetailRow label="Role">
                <select
                  value={selectedUser.role}
                  onChange={(e) => changeRole(selectedUser.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </DetailRow>
              <DetailRow label="Email Verified" value={selectedUser.emailVerified ? "Yes" : "No"} />
              <DetailRow label="Status" value={selectedUser.blocked ? "Blocked" : "Active"} />
              <DetailRow label="City" value={selectedUser.city || "Not set"} />
              <DetailRow label="Login Count" value={String(selectedUser.loginCount)} />
              <DetailRow label="Last IP" value={selectedUser.lastLoginIp || "N/A"} masked />
              <DetailRow label="Last Device" value={selectedUser.lastLoginDevice || "N/A"} />
              <DetailRow label="Joined" value={new Date(selectedUser.createdAt).toLocaleDateString()} />
            </div>

            {/* Login History */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Login History</h4>
              {historyLoading ? (
                <p className="text-xs text-gray-400">Loading...</p>
              ) : loginHistory.length === 0 ? (
                <p className="text-xs text-gray-400">No login records</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {loginHistory.slice(0, 20).map((record, i) => (
                    <div key={i} className={`text-xs p-2 rounded-lg ${record.success ? "bg-green-50" : "bg-red-50"}`}>
                      <div className="flex justify-between">
                        <span className={`font-medium ${record.success ? "text-green-700" : "text-red-700"}`}>
                          {record.success ? "Success" : "Failed"}
                        </span>
                        <span className="text-gray-400">{record.method}</span>
                      </div>
                      <p className="text-gray-500 mt-0.5">{new Date(record.timestamp).toLocaleString()}</p>
                      <p className="text-gray-400">{record.ip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colors[color]?.split(" ")[1] || "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value, children, masked }: { label: string; value?: string; children?: React.ReactNode; masked?: boolean }) {
  const [showMasked, setShowMasked] = useState(false);
  const displayValue = masked && !showMasked && value && value !== "N/A"
    ? value.replace(/(\d{1,3})\.\d+\.\d+\.(\d{1,3})/, "$1.***.***.$2")
    : value;

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      {children || (
        <span className="text-gray-900 font-medium flex items-center gap-1">
          {displayValue}
          {masked && value && value !== "N/A" && (
            <button onClick={() => setShowMasked(!showMasked)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {showMasked ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                ) : (
                  <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>
                )}
              </svg>
            </button>
          )}
        </span>
      )}
    </div>
  );
}

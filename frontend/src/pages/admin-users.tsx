import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getStoredUser } from "../utils/auth";

interface AdminUser {
  id: string;
  login: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  role: "admin" | "user";
  addedBy?: string;
  createdAt?: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Add-user form state
  const [login, setLogin] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const current = getStoredUser();
  const token = current?.token;
  const backend = import.meta.env.VITE_BACKEND_URL;
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${backend}/admin/users`, authHeader);
      setUsers(resp.data);
    } catch (e) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim()) {
      toast.error("GitHub username is required");
      return;
    }
    setAdding(true);
    try {
      await axios.post(
        `${backend}/admin/users`,
        { login: login.trim(), role, email: email.trim() || undefined },
        authHeader
      );
      toast.success(`Added @${login.trim()}`);
      setLogin("");
      setEmail("");
      setRole("user");
      await fetchUsers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add user");
    } finally {
      setAdding(false);
    }
  };

  const handleRoleToggle = async (u: AdminUser) => {
    const next = u.role === "admin" ? "user" : "admin";
    setBusyId(u.id);
    try {
      await axios.patch(
        `${backend}/admin/users/${u.id}/role`,
        { role: next },
        authHeader
      );
      toast.success(`@${u.login} is now ${next}`);
      await fetchUsers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update role");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (u: AdminUser) => {
    if (!window.confirm(`Remove access for @${u.login}?`)) return;
    setBusyId(u.id);
    try {
      await axios.delete(`${backend}/admin/users/${u.id}`, authHeader);
      toast.success(`Removed @${u.login}`);
      await fetchUsers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to remove user");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            User Management
          </h1>
          <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to dashboard
          </Link>
        </div>

        {/* Add user */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap items-end gap-3"
        >
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">GitHub username</label>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="e.g. octocat"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-56 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-56 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "user")}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-black disabled:opacity-50"
          >
            {adding ? "Adding…" : "Add user"}
          </button>
        </form>

        {/* User list */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading…</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users yet. Add one above.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Added by</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = current?.id === u.id;
                  return (
                    <tr key={u.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.login}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                          )}
                          <div>
                            <div className="font-medium text-gray-800">
                              {u.name || u.login}
                            </div>
                            <div className="text-gray-400">@{u.login}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {u.email || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {u.addedBy ? `@${u.addedBy}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={busyId === u.id || isSelf}
                            onClick={() => handleRoleToggle(u)}
                            title={isSelf ? "You can't change your own role" : ""}
                            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 disabled:opacity-50"
                          >
                            {u.role === "admin" ? "Make user" : "Make admin"}
                          </button>
                          <button
                            disabled={busyId === u.id || isSelf}
                            onClick={() => handleDelete(u)}
                            title={isSelf ? "You can't remove yourself" : ""}
                            className="px-3 py-1 rounded-md bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../_components/Button";
import Modal from "../_components/Modal";
import StatusBadge from "../_components/StatusBadge";
import EmptyState from "../_components/EmptyState";
import UserForm, { UserFormValues } from "./UserForm";
import { formatDate } from "@/lib/serialize";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export default function UsersClient({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string | null;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<UserFormValues | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onDelete(user: User) {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    setError(null);
    setBusyId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not delete user.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      {error && (
        <div className="rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4" />
          New user
        </Button>
      </div>

      {users.length === 0 ? (
        <EmptyState
          title="No users yet"
          description="Add your first director or finance team member to grant them access."
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus className="w-4 h-4" />
              New user
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Last login</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-white font-medium">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-white/40">(you)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/70 text-xs hidden md:table-cell">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          u.isActive
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {u.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs hidden lg:table-cell">
                      {formatDate(u.lastLoginAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          onClick={() =>
                            setEditing({
                              id: u.id,
                              name: u.name,
                              email: u.email,
                              role: u.role,
                              isActive: u.isActive,
                            })
                          }
                          className="text-xs text-white/60 hover:text-white"
                        >
                          Edit
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => onDelete(u)}
                            disabled={busyId === u.id}
                            className="text-xs text-white/40 hover:text-rose-400 disabled:opacity-50"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New user"
        size="lg"
      >
        <UserForm onClose={() => setCreating(false)} />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit user"
        size="lg"
      >
        {editing && <UserForm initial={editing} onClose={() => setEditing(null)} />}
      </Modal>
    </>
  );
}

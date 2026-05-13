"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Search, Users, Trash2, Shield, ShieldOff, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/endpoints";
import { Card, CardBody, Badge, Avatar } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Skeleton, EmptyState } from "@/components/ui/feedback";
import { formatDate, formatRelative } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import type { UserRole } from "@/types";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", search, roleFilter],
    queryFn: () => adminApi.listUsers({
      search: search || undefined,
      role: roleFilter || undefined,
    }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: { role?: UserRole; is_active?: boolean } }) =>
      adminApi.updateUser(id, body),
    onSuccess: () => {
      toast.success("User updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
      <header className="mb-8">
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-2">
          Admin · Users
        </p>
        <h1 className="font-display text-4xl text-ink-900 leading-tight">
          Members
        </h1>
        <p className="text-ink-500 mt-1">
          {users?.length ?? 0} users across the platform.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-400 pointer-events-none" />
          <Input
            placeholder="Search by email or username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
          className="w-40"
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </Select>
      </div>

      <Card>
        {isLoading ? (
          <CardBody><Skeleton className="h-32" /></CardBody>
        ) : !users || users.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={<Users className="h-5 w-5" />}
              title="No users found"
              description={search ? "Try a different search." : undefined}
            />
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium">User</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden sm:table-cell">Role</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden md:table-cell">XP / Level</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden lg:table-cell">Joined</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden lg:table-cell">Last active</th>
                  <th className="px-5 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.full_name || u.username} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink-900 truncate flex items-center gap-2">
                              {u.full_name || u.username}
                              {isSelf && <span className="text-2xs font-mono text-ink-400">(you)</span>}
                            </p>
                            <p className="text-2xs text-ink-500 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        {u.role === "admin" ? (
                          <Badge variant="accent">Admin</Badge>
                        ) : (
                          <Badge>User</Badge>
                        )}
                        {!u.is_active && <Badge variant="danger" className="ml-1">Inactive</Badge>}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-sm text-ink-700">
                          <span className="font-mono">{u.xp}</span> XP · L{u.level}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-2xs font-mono text-ink-500 hidden lg:table-cell">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-5 py-3 text-2xs font-mono text-ink-500 hidden lg:table-cell">
                        {u.last_active_at ? formatRelative(u.last_active_at) : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {!isSelf && (
                            <>
                              <button
                                onClick={() => updateMutation.mutate({
                                  id: u.id,
                                  body: { role: u.role === "admin" ? "user" : "admin" },
                                })}
                                className="p-1.5 rounded text-ink-500 hover:text-ink-900 hover:bg-ink-100"
                                title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                              >
                                {u.role === "admin"
                                  ? <ShieldOff className="h-3.5 w-3.5" />
                                  : <Shield className="h-3.5 w-3.5" />}
                              </button>
                              <button
                                onClick={() => updateMutation.mutate({
                                  id: u.id,
                                  body: { is_active: !u.is_active },
                                })}
                                className="p-1.5 rounded text-ink-500 hover:text-ink-900 hover:bg-ink-100"
                                title={u.is_active ? "Deactivate" : "Activate"}
                              >
                                {u.is_active
                                  ? <UserX className="h-3.5 w-3.5" />
                                  : <UserCheck className="h-3.5 w-3.5" />}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete user "${u.username}"? This cannot be undone.`)) {
                                    deleteMutation.mutate(u.id);
                                  }
                                }}
                                className="p-1.5 rounded text-ink-500 hover:text-danger hover:bg-red-50"
                                title="Delete user"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
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
      </Card>
    </div>
  );
}

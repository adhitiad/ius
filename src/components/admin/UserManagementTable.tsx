"use client";

import React, { useEffect, useMemo, useState } from "react";
import { UserProfile, UserRole, UserPlan } from "@/types/api";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

interface UserManagementTableProps {
  initialUsers: UserProfile[];
  isLoading?: boolean;
}

const ROLE_OPTIONS: UserRole[] = ["user", "pengelola", "owner"];
const PLAN_OPTIONS: UserPlan[] = ["free", "pro", "bisnis", "enterprise"];

export function UserManagementTable({
  initialUsers,
  isLoading = false,
}: UserManagementTableProps) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleUpdate = async (
    user: UserProfile,
    nextRole: UserRole,
    nextPlan: UserPlan,
  ) => {
    try {
      const updatedUser = await adminService.updateUserRolePlan(user.id, {
        role: nextRole,
        plan: nextPlan,
      });
      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? updatedUser : item)),
      );
      toast.success(`Role/plan ${updatedUser.email} berhasil diperbarui.`);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Gagal update role/plan user.");
    }
  };

  const columns = useMemo<ColumnDef<UserProfile>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "User",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
              <User className="size-5" />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight">
                {row.original.fullName}
              </div>
              <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-tighter">
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.role;
          const plan = row.original.plan;
          return (
            <select
              value={role}
              onChange={(e) =>
                handleUpdate(row.original, e.target.value as UserRole, plan)
              }
              className={cn(
                "bg-zinc-900/60 border border-white/5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest outline-none focus:border-emerald-500/50 appearance-none cursor-pointer",
                role === "owner"
                  ? "text-amber-400"
                  : role === "admin"
                    ? "text-emerald-400"
                    : "text-zinc-400",
              )}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        },
      },
      {
        accessorKey: "plan",
        header: "Subscription Plan",
        cell: ({ row }) => {
          const role = row.original.role;
          const plan = row.original.plan;
          return (
            <select
              value={plan}
              onChange={(e) =>
                handleUpdate(row.original, role, e.target.value as UserPlan)
              }
              className={cn(
                "bg-zinc-900/60 border border-white/5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider outline-none focus:border-emerald-500/50 appearance-none cursor-pointer",
                plan === "enterprise"
                  ? "text-violet-400"
                  : plan === "bisnis"
                    ? "text-blue-400"
                    : plan === "pro"
                      ? "text-emerald-400"
                      : "text-zinc-500",
              )}
            >
              {PLAN_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        },
      },
      {
        accessorKey: "returnPercentage",
        header: "Return",
        cell: ({ row }) => (
          <div className="text-zinc-400 font-mono text-xs">
            {row.original.returnPercentage.toFixed(2)}%
          </div>
        ),
      },
      {
        accessorKey: "telegramId",
        header: "Telegram",
        cell: ({ row }) => (
          <div className="text-zinc-500 text-xs">
            {row.original.telegramId || "-"}
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-white/5">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-white/5">
          {isLoading && (
            <tr>
              <td className="px-6 py-8 text-zinc-500" colSpan={columns.length}>
                Memuat data pengguna...
              </td>
            </tr>
          )}
          {!isLoading && !table.getRowModel().rows.length && (
            <tr>
              <td className="px-6 py-8 text-zinc-500" colSpan={columns.length}>
                Tidak ada data pengguna.
              </td>
            </tr>
          )}
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-6">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

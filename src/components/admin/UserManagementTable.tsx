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
import { User, ChevronDown, Rocket, Shield, Crown } from "lucide-react";
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
        header: "User Personnel",
        cell: ({ row }) => (
          <div className="flex items-center gap-4 py-1">
            <div className="relative group/avatar">
               <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
               <div className="size-11 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 relative z-10 transition-transform group-hover/avatar:-translate-y-1">
                 <User className="size-5" />
               </div>
            </div>
            <div>
              <div className="font-black text-white tracking-tight leading-none mb-1">
                {row.original.fullName}
              </div>
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Access Level",
        cell: ({ row }) => {
          const role = row.original.role;
          const plan = row.original.plan;
          return (
            <div className="relative inline-flex items-center">
              <select
                value={role}
                onChange={(e) =>
                  handleUpdate(row.original, e.target.value as UserRole, plan)
                }
                className={cn(
                  "bg-zinc-950/60 border border-white/5 pl-3 pr-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-primary/50 appearance-none cursor-pointer h-10 min-w-[120px] transition-all hover:bg-black",
                  role === "owner" ? "text-amber-400" : role === "pengelola" ? "text-emerald-400" : "text-zinc-500",
                )}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-zinc-950 text-white">
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3 absolute right-3 pointer-events-none text-zinc-600" />
            </div>
          );
        },
      },
      {
        accessorKey: "plan",
        header: "License Type",
        cell: ({ row }) => {
          const role = row.original.role;
          const plan = row.original.plan;
          return (
            <div className="relative inline-flex items-center">
              <select
                value={plan}
                onChange={(e) =>
                  handleUpdate(row.original, role, e.target.value as UserPlan)
                }
                className={cn(
                  "bg-zinc-950/60 border border-white/5 pl-3 pr-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-primary/50 appearance-none cursor-pointer h-10 min-w-[140px] transition-all hover:bg-black",
                  plan === "enterprise" ? "text-violet-400" : plan === "bisnis" ? "text-blue-400" : plan === "pro" ? "text-emerald-400" : "text-zinc-600",
                )}
              >
                {PLAN_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-zinc-950 text-white">
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3 absolute right-3 pointer-events-none text-zinc-600" />
            </div>
          );
        },
      },
      {
        accessorKey: "returnPercentage",
        header: "Activity Score",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
             <div className="w-16 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full",
                    row.original.returnPercentage > 0 ? "bg-emerald-500" : "bg-rose-500"
                  )} 
                  style={{ width: `${Math.min(100, Math.abs(row.original.returnPercentage) * 5)}%` }}
                />
             </div>
             <span className="font-mono text-[10px] font-black text-zinc-400">
                {row.original.returnPercentage.toFixed(2)}%
             </span>
          </div>
        ),
      },
      {
        accessorKey: "telegramId",
        header: "Comm Node",
        cell: ({ row }) => (
          <span className="text-[10px] font-bold text-zinc-600 tracking-widest font-mono">
            {row.original.telegramId ? `@${row.original.telegramId}` : "UNLINKED"}
          </span>
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
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-white/5">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 bg-white/[0.01]"
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
              <td className="px-8 py-20 text-center" colSpan={columns.length}>
                <div className="flex flex-col items-center gap-3">
                   <div className="size-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                     Mendekripsi Data Personil...
                   </p>
                </div>
              </td>
            </tr>
          )}
          {!isLoading && !table.getRowModel().rows.length && (
            <tr>
              <td className="px-8 py-20 text-center" colSpan={columns.length}>
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                  Database Personil Kosong
                </p>
              </td>
            </tr>
          )}
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="group hover:bg-white/[0.02] transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-8 py-6">
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

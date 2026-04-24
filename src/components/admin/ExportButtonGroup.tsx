"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";

export const ExportButtonGroup = () => {
  const handleExportExcel = async () => {
    try {
      toast.info("Menyiapkan laporan keuangan Excel...");
      const blob = await adminService.exportFinancialReport();
      const fileName = `UIS-OTAK_Financial_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
      saveAs(blob, fileName);
      toast.success("Laporan Excel berhasil diunduh.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Gagal mengunduh laporan Excel.",
      );
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={handleExportExcel}
        className="h-11 bg-emerald-500 text-black hover:bg-emerald-400 font-black uppercase tracking-wider"
      >
        <Download className="mr-2 h-4 w-4" /> Export Excel
      </Button>
    </div>
  );
};

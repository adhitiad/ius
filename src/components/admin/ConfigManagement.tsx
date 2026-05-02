"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import { SystemConfig } from "@/types/api";
import {
  Check,
  Copy,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ConfigManagement() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [fetchingTg, setFetchingTg] = useState(false);
  const [tgUpdates, setTgUpdates] = useState<
    { name: string; id: string; type: string }[]
  >([]);
  const [showTgModal, setShowTgModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllConfigs();
      setConfigs(data);
    } catch (error) {
      console.error("Failed to load configs:", error);
      toast.error("Gagal memuat konfigurasi sistem");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleUpdate = async (key: string, value: string) => {
    try {
      setSavingKey(key);
      await adminService.updateConfig(key, { value });
      toast.success(`Konfigurasi ${key} berhasil diperbarui`);
      loadConfigs();
    } catch (error) {
      console.error("Failed to update config:", error);
      toast.error(`Gagal memperbarui ${key}`);
    } finally {
      setSavingKey(null);
    }
  };

  const handleFetchTgUpdates = async () => {
    try {
      setFetchingTg(true);
      const data = await adminService.getTelegramUpdates();
      setTgUpdates(data.chat_ids);
      setShowTgModal(true);
    } catch (error) {
      console.error("Failed to fetch TG updates:", error);
      toast.error(
        "Gagal mengambil update Telegram. Pastikan bot token sudah benar.",
      );
    } finally {
      setFetchingTg(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("ID berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const telegramConfigs = configs.filter(
    (c) =>
      c.key.toLowerCase().includes("tg") ||
      c.key.toLowerCase().includes("telegram"),
  );
  const otherConfigs = configs.filter(
    (c) =>
      !c.key.toLowerCase().includes("tg") &&
      !c.key.toLowerCase().includes("telegram"),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Settings className="size-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic">
              System <span className="text-zinc-600">Configurations</span>
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.3em]">
              Centralized Neural Grid Parameters
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadConfigs}
          disabled={loading}
          className="rounded-xl border-white/5 bg-white/2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-10 px-6"
        >
          <RefreshCw className={cn("size-3 mr-2", loading && "animate-spin")} />
          Reload
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Telegram Configs */}
        <Card className="rounded-[2.5rem] bg-zinc-950/40 border-white/10 overflow-hidden backdrop-blur-xl group">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Send className="size-5 text-blue-400" />
              </div>
              <CardTitle className="text-xl font-black italic tracking-tight text-white">
                Telegram Bot Integration
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFetchTgUpdates}
              disabled={fetchingTg}
              className="rounded-xl border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-[10px] font-black uppercase tracking-widest text-blue-400 h-9"
            >
              {fetchingTg ? (
                <RefreshCw className="size-3 animate-spin mr-2" />
              ) : (
                <Search className="size-3 mr-2" />
              )}
              Find IDs
            </Button>
          </div>
          <CardContent className="p-8 space-y-6">
            {telegramConfigs.length > 0 ? (
              telegramConfigs.map((config) => (
                <ConfigItem
                  key={config.id}
                  config={config}
                  onSave={handleUpdate}
                  isSaving={savingKey === config.key}
                />
              ))
            ) : (
              <p className="text-zinc-500 text-xs italic py-4">
                No Telegram configurations found.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Other Configs */}
        <Card className="rounded-[2.5rem] bg-zinc-950/40 border-white/10 overflow-hidden backdrop-blur-xl group">
          <CardHeader className="p-8 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="size-5 text-emerald-400" />
              </div>
              <CardTitle className="text-xl font-black italic tracking-tight text-white">
                System Flags & Parameters
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {otherConfigs.length > 0 ? (
              otherConfigs.map((config) => (
                <ConfigItem
                  key={config.id}
                  config={config}
                  onSave={handleUpdate}
                  isSaving={savingKey === config.key}
                />
              ))
            ) : (
              <p className="text-zinc-500 text-xs italic py-4">
                No other configurations found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Telegram ID Modal */}
      {showTgModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-transparent flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black italic text-white tracking-tight">
                  Recent Chat IDs
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  Found from bot updates
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTgModal(false)}
                className="rounded-full size-10 p-0 hover:bg-white/5"
              >
                ✕
              </Button>
            </div>
            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
              {tgUpdates.length > 0 ? (
                tgUpdates.map((update, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group/row hover:bg-white/10 transition-all"
                  >
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                        {update.type}
                      </p>
                      <h4 className="text-sm font-bold text-white">
                        {update.name}
                      </h4>
                      <code className="text-[11px] text-zinc-500 font-mono mt-1 block">
                        {update.id}
                      </code>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(update.id)}
                      className="rounded-xl h-10 w-10 hover:bg-blue-500/20 hover:text-blue-400"
                    >
                      {copiedId === update.id ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="size-16 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto">
                    <Search className="size-8 text-zinc-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-400">
                      No recent activity found.
                    </p>
                    <p className="text-xs text-zinc-600 px-8">
                      Kirim pesan apapun ke Bot atau grup di mana bot berada,
                      lalu coba lagi.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 bg-zinc-900/50 border-t border-white/5 flex justify-end">
              <Button
                onClick={() => setShowTgModal(false)}
                className="rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] h-10 px-8 hover:bg-zinc-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigItem({
  config,
  onSave,
  isSaving,
}: {
  config: SystemConfig;
  onSave: (key: string, value: string) => void;
  isSaving: boolean;
}) {
  const [value, setValue] = useState(config.value);

  return (
    <div className="space-y-2 group/item">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          {config.key}
        </label>
        <span className="text-[8px] text-zinc-700 font-mono">
          Last updated: {new Date(config.updated_at).toLocaleString()}
        </span>
      </div>
      <div className="flex gap-3">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-12 bg-white/2 border-white/5 rounded-xl text-sm font-bold text-white focus:bg-white/5 transition-all"
          placeholder={`Enter value for ${config.key}...`}
        />
        <Button
          onClick={() => onSave(config.key, value)}
          disabled={isSaving || value === config.value}
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
            value === config.value
              ? "bg-zinc-900 text-zinc-700 border border-white/5"
              : "bg-primary text-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95",
          )}
        >
          {isSaving ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
        </Button>
      </div>
      {config.description && (
        <p className="text-[10px] text-zinc-600 font-medium italic pl-1">
          {config.description}
        </p>
      )}
    </div>
  );
}

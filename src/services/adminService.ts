import api from "@/lib/api";
import {
  ApiUserProfile,
  FinanceDashboardResponse,
  SystemHealthResponse,
  UserPlan,
  UserProfile,
  UserRole,
  SystemConfig,
  SystemConfigUpdate,
} from "@/types/api";

const normalizeUserProfile = (user: ApiUserProfile): UserProfile => ({
  id: user.id,
  email: user.email,
  fullName: user.full_name?.trim() || user.email.split("@")[0],
  role: user.role,
  plan: user.plan,
  telegramId: user.telegram_id ?? null,
  whatsappId: user.whatsapp_id ?? null,
  subscriptionExpiresAt: user.subscription_expires_at ?? null,
  isActive: !!user.is_active,
  returnPercentage: Number(user.return_percentage ?? 0),
});

/**
 * Admin Management Service
 */
export const adminService = {
  /**
   * Fetch all users for admin review
   */
  getAllUsers: async (): Promise<UserProfile[]> => {
    const response = await api.get<ApiUserProfile[]>("/admin/users");
    return response.data.map(normalizeUserProfile);
  },

  /**
   * Update user role and plan
   */
  updateUserRolePlan: async (
    userId: number,
    data: { role: UserRole; plan: UserPlan }
  ): Promise<UserProfile> => {
    const response = await api.put<ApiUserProfile>(`/admin/users/${userId}/role`, {
      role: data.role,
      plan: data.plan,
    });
    return normalizeUserProfile(response.data);
  },

  /**
   * Export financial report as Excel Blob
   */
  exportFinancialReport: async (): Promise<Blob> => {
    const response = await api.get("/finance/export", {
      params: { export_format: "excel" },
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Get finance summary cards for admin command center.
   */
  getFinanceDashboard: async (): Promise<FinanceDashboardResponse> => {
    const response = await api.get<FinanceDashboardResponse>("/finance/dashboard");
    return response.data;
  },

  /**
   * Get all system configurations (Owner only)
   */
  getAllConfigs: async (): Promise<SystemConfig[]> => {
    const response = await api.get<SystemConfig[]>("/admin/config");
    return response.data;
  },

  /**
   * Update a system configuration (Owner only)
   */
  updateConfig: async (
    key: string,
    data: SystemConfigUpdate
  ): Promise<SystemConfig> => {
    const response = await api.put<SystemConfig>(`/admin/config/${key}`, data);
    return response.data;
  },

  /**
   * Get infrastructure telemetry including CPU/RAM + cloud dependency status.
   */
  getSystemHealth: async (): Promise<SystemHealthResponse> => {
    const response = await api.get<SystemHealthResponse>("/system/health");
    return response.data;
  },
  /**
   * Get recent Telegram updates to find Chat IDs.
   */
  getTelegramUpdates: async (): Promise<{ chat_ids: { name: string; id: string; type: string }[] }> => {
    const response = await api.get("/admin/telegram/updates");
    return response.data;
  },
  /**
   * Run infrastructure intelligence audit and send alerts if needed.
   */
  simulateIntelligenceAudit: async (): Promise<any> => {
    const response = await api.post("/system/simulate-intelligence-alert");
    return response.data;
  },
  /**
   * Get autonomous agent activity logs.
   */
  getAgentLogs: async (limit: number = 50): Promise<any[]> => {
    const response = await api.get("/agent/logs", { params: { limit } });
    return response.data;
  },
  /**
   * Get operational status of the autonomous agent.
   */
  getAgentStatus: async (): Promise<any> => {
    const response = await api.get("/agent/status");
    return response.data;
  },
  /**
   * Get agent top picks (Top 20).
   */
  getAgentTopPicks: async (timeframe: string = "daily"): Promise<any[]> => {
    const response = await api.get(`/agent/top-picks?timeframe=${timeframe}`);
    return response.data;
  },
  notifyLLMMigration: async (): Promise<any> => {
    const response = await api.post(`/agent/notify-migration`);
    return response.data;
  },
  startAgent: async (): Promise<any> => {
    const response = await api.post(`/agent/start`);
    return response.data;
  },
  stopAgent: async (): Promise<any> => {
    const response = await api.post(`/agent/stop`);
    return response.data;
  },
  clearAgentLogs: async (): Promise<any> => {
    const response = await api.delete(`/agent/logs`);
    return response.data;
  },
  purgeGroq: async (): Promise<any> => {
    const response = await api.post(`/agent/purge-groq`);
    return response.data;
  },
};

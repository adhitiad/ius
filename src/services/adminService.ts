import api from "@/lib/api";
import {
  ApiUserProfile,
  FinanceDashboardResponse,
  SystemHealthResponse,
  UserPlan,
  UserProfile,
  UserRole,
} from "@/types/api";

const normalizeUserProfile = (user: ApiUserProfile): UserProfile => ({
  id: user.id,
  email: user.email,
  fullName: user.full_name?.trim() || user.email.split("@")[0],
  role: user.role,
  plan: user.plan,
  telegramId: user.telegram_id ?? null,
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
   * Get infrastructure telemetry including CPU/RAM + cloud dependency status.
   */
  getSystemHealth: async (): Promise<SystemHealthResponse> => {
    const response = await api.get<SystemHealthResponse>("/system/health");
    return response.data;
  },
};

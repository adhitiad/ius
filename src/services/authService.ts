import api from "@/lib/api";
import {
  ApiUserProfile,
  LoginCredentials,
  LoginResponse,
  UserProfile,
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
  isActive: user.is_active,
  returnPercentage: Number(user.return_percentage ?? 0),
});

export interface AuthenticatedSession {
  token: string;
  user: UserProfile;
}

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login user to UIS-OTAK
   */
  login: async (credentials: LoginCredentials): Promise<AuthenticatedSession> => {
    const loginResponse = await api.post<LoginResponse>("/auth/login", credentials);
    const token = loginResponse.data.access_token;

    const profileResponse = await api.get<ApiUserProfile>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      token,
      user: normalizeUserProfile(profileResponse.data),
    };
  },

  /**
   * Get current authenticated user profile
   */
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await api.get<ApiUserProfile>("/auth/me");
    return normalizeUserProfile(response.data);
  },

  /**
   * Update user Telegram ID for notifications
   */
  updateTelegramId: async (telegramId: string): Promise<UserProfile> => {
    const response = await api.put<ApiUserProfile>("/users/telegram", {
      telegram_id: telegramId,
    });
    return normalizeUserProfile(response.data);
  },

  /**
   * Update user WhatsApp ID for notifications
   */
  updateWhatsappId: async (whatsappId: string): Promise<UserProfile> => {
    const response = await api.put<ApiUserProfile>("/users/whatsapp", {
      whatsapp_id: whatsappId,
    });
    return normalizeUserProfile(response.data);
  },
};

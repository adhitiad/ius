import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

interface UpdateProfilePayload {
  telegramId?: string;
  whatsappId?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      let updatedUser;
      if (payload.telegramId !== undefined) {
        updatedUser = await authService.updateTelegramId(payload.telegramId);
      }
      if (payload.whatsappId !== undefined) {
        updatedUser = await authService.updateWhatsappId(payload.whatsappId);
      }
      return updatedUser;
    },
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      if (user && updatedProfile) {
        updateUser(updatedProfile);
      }
    },
  });
};

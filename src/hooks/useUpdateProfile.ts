import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

interface UpdateProfilePayload {
  telegramId: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      return authService.updateTelegramId(payload.telegramId);
    },
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      if (user) {
        updateUser({
          telegramId: updatedProfile.telegramId,
        });
      }
    },
  });
};

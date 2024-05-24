import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const {mutateAsync: updateProfile, isPending: isUpdatingProfile} =
    useMutation({
      mutationFn: async (formData) => {
        try {
          const res = await fetch(`/api/users/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Something went wrong");
          }
          if (data.success) {
            toast.success(data.message);
          }
          return data;
        } catch (error) {
          throw new Error(error.message);
        }
      },
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries({queryKey: ["authUser"]}),
          queryClient.invalidateQueries({queryKey: ["userProfile"]}),
        ]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return {updateProfile, isUpdatingProfile};
};

export default useUpdateUserProfile;

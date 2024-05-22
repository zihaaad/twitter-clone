import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

const useFollow = () => {
  const queryClient = useQueryClient();

  const {mutate: follow, isPending} = useMutation({
    mutationFn: async (userId) => {
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      }
      if (!res.ok) {
        throw new Error(data.message || "something went wrong!");
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
        queryClient.invalidateQueries({queryKey: ["authUser"]}),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {follow, isPending};
};

export default useFollow;

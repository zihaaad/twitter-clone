import {useQuery} from "@tanstack/react-query";

const useAuth = () => {
  const {data: authUser, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.success) return null;
        if (!res.ok) {
          throw new Error(data.message || "Something wnet wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  return {authUser, isLoading};
};

export default useAuth;

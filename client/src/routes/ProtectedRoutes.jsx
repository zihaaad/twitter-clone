/* eslint-disable react/prop-types */
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {Navigate} from "react-router-dom";

export const ProtectedRoutes = ({children}) => {
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
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

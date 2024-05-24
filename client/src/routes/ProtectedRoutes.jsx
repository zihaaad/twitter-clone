/* eslint-disable react/prop-types */
import LoadingSpinner from "../components/common/LoadingSpinner";
import {Navigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const ProtectedRoutes = ({children}) => {
  const {authUser, isLoading} = useAuth();

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

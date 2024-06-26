import {useState} from "react";
import {Link, Navigate} from "react-router-dom";

import {MdOutlineMail} from "react-icons/md";
import {MdPassword} from "react-icons/md";
import XSvg from "../../../components/svg/X";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Toaster, toast} from "sonner";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const queryClient = useQueryClient();
  const {authUser, isLoading} = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const {mutate, isError, isPending, error} = useMutation({
    mutationFn: async ({username, password}) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({username, password}),
        });

        const data = await res.json();
        if (!data.success) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          setFormData({
            username: "",
            password: "",
          });
        }
      } catch (error) {
        toast.error("something went wrong");
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  if (!isLoading && authUser?.data) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-[62%] fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="flex w-4/5 md:w-2/4 lg:w-2/3 gap-4 flex-col"
          onSubmit={handleSubmit}>
          <XSvg className="lg:hidden w-24 fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Sign In"}
          </button>
          {isError && (
            <p className="text-red-500">{error || "something went wrong"}</p>
          )}
        </form>
        <div className="flex flex-col gap-2 mt-4  md:w-1/2 lg:w-2/3">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Login;

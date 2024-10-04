"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "@/public/images/logo.svg";
import Banner from "@/public/images/banner.png";
import "../styles.css";
import Link from "next/link";
import InputForm from "@/components/common/InputForm";
import ButtonComponent from "@/components/common/ButtonComponent";
import { useRouter } from "next/navigation";
import { authLogin } from "@/api/auth";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/reducers/userInfoSlice";
import { getAuthToken } from "@/libs/clients";

const AuthLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    server: "",
  });

  useEffect(() => {
    dispatch(setUserInfo(null));
    const accessToken = getAuthToken();
    if (!!accessToken) {
      router.push("/news");
    }
  }, []);

  const onSubmit = () => {
    setErrors({ username: "", password: "", server: "" });

    if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must contain at least one uppercase letter, one number, and be at least 8 characters long.",
      }));
      return;
    }

    setIsLoading(true);
    authLogin({ username, password })
      .then((res) => {
        if (res) {
          localStorage.setItem("accessToken", res.access);
          router.push("/news");
        }
      })
      .catch((err) => {
        console.log(err);
        setErrors((prev) => ({
          ...prev,
          server: "Password or username is incorrect.",
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
  };

  return (
    <div className="w-[100vw] h-[100vh] flex bg-[#000000]">
      <div className="left-container flex-1 flex flex-col">
        <div className="logo-container">
          <Image
            src={Logo}
            alt="logo"
            className="image"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="form-container">
          <div className="form-header">
            <h1 className="mb-[16px]">Login account</h1>
            <h3>Welcome to hustly.space, champ</h3>
          </div>
          <div className="form-wrapper">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <InputForm
                title={"Email"}
                placeholder={"Enter your email..."}
                name="username"
                required={true}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: "" }));
                }}
              />
              {errors.username && (
                <div className="text-[#ff0000] text-[12px]">
                  {errors.username}
                </div>
              )}
              <InputForm
                title={"Password"}
                placeholder={"Enter your password..."}
                name="password"
                required={true}
                isPassword={true}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              {errors.password && (
                <div className="text-[#ff0000] text-[12px]">
                  {errors.password}
                </div>
              )}
              {errors.server && (
                <div className="text-[#ff0000] text-[12px]">
                  {errors.server}
                </div>
              )}
              <div className="form-footer">
                <ButtonComponent
                  type={"submit"}
                  title={isLoading ? <BeatLoader color="#000" size={6} /> : "Sign in"}
                />
                <span>
                  Dont have an account?{" "}
                  <Link className="action" href={"/auth-register"}>
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-1 p-[22px]">
        <Image src={Banner} alt="banner" className="banner-auth" />
      </div>
    </div>
  );
};

export default AuthLogin;

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/Account/Profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <FormControl 
        id="wd-username"
        placeholder="username"
        className="mb-2"
        value={user.username || ""}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <FormControl 
        id="wd-password"
        placeholder="password" 
        type="password"
        className="mb-2"
        value={user.password || ""}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button 
        id="wd-signin-btn"
        onClick={signup}
        className="btn btn-primary w-100 mb-2"
      >
        Sign up
      </button>
      <Link id="wd-signup-link" href="/Account/Signin">Sign in</Link>
    </div>
  );
}
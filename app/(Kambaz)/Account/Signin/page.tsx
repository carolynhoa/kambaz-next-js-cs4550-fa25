"use client";
import * as client from "../client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";

interface Credentials {
  username?: string;
  password?: string;
}

export default function Signin() {
  const [credentials, setCredentials] = useState<Credentials>({});
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    router.push("/Dashboard");
  };

  return (
    <div id="wd-signin-screen" className="container mt-4" style={{ maxWidth: 600 }}>
      <h1 className="mb-3">Sign in</h1>

      <FormControl
        value={credentials.username || ""}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />

      <FormControl
        value={credentials.password || ""}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-3"
        placeholder="password"
        type="password"
        id="wd-password"
      />

      <Button onClick={signin} id="wd-signin-btn" className="w-100 mb-3" variant="danger">
        Sign in
      </Button>

      <Link id="wd-signup-link" href="/Account/Signup">
        Sign up
      </Link>

      <div className="mt-5 p-3 border rounded bg-light">
        <h4 className="mb-3">Kambaz Quizzes Final Project</h4>

        <p className="mb-1">
          <b>Student:</b> Carolyn Hoa
        </p>
        <p className="mb-3">
          <b>Course Section:</b> CS4550.11597.202610
        </p>

        <p className="fw-bold mb-1">GitHub Repositories:</p>
        <ul>
          <li>
            <a
              href="https://github.com/carolynhoa/kambaz-next-js-cs4550-fa25/tree/quizzes"
              target="_blank"
            >
              Frontend Repository
            </a>
          </li>
          <li>
            <a
              href="https://github.com/carolynhoa/-kambaz-node-server-app/tree/quizzes"
              target="_blank"
            >
              Backend Repository
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

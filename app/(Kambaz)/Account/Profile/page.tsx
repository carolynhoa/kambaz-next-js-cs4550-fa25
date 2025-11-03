/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import Link from "next/link";
import { FormControl, Button } from "react-bootstrap";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const fetchProfile = () => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }
    setProfile(currentUser);
  };
  
  const signout = () => {
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };
  
  useEffect(() => {
    fetchProfile();
  }, [currentUser]);
 
  return (
    <div id="wd-profile-screen" className="p-4">
      <h3>Profile</h3>
      {profile && (
        <div>
          <FormControl
            id="wd-username"
            className="mb-2"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            placeholder="Username"
          />
          <FormControl
            id="wd-password"
            className="mb-2"
            value={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            type="password"
            placeholder="Password"
          />
          <FormControl
            id="wd-firstname"
            className="mb-2"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            placeholder="First Name"
          />
          <FormControl
            id="wd-lastname"
            className="mb-2"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            placeholder="Last Name"
          />
          <FormControl
            id="wd-dob"
            className="mb-2"
            type="date"
            value={profile.dob}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <FormControl
            id="wd-email"
            className="mb-2"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
          />
          <select
            className="form-control mb-2"
            id="wd-role"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>
          <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
            Sign out
          </Button>
          <Link href="/Dashboard">
            <Button variant="secondary" className="w-100">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      )}
      {!profile && (
        <div className="alert alert-info">
          Loading profile...
        </div>
      )}
    </div>
  );
}

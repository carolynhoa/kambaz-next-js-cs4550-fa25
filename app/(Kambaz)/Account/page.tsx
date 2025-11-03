"use client";
import { useSelector } from "react-redux";
import { redirect } from "next/dist/client/components/navigation";


export default function AccountPage() {
const { currentUser } = useSelector((state: { accountReducer: { currentUser: unknown } }) => state.accountReducer);
if (!currentUser) {
 redirect("/Account/Signin");
} else {
    redirect("/Account/Profile");
  }
 
}
"use client";

import { useSession } from "next-auth/react";
import { logout } from "@/actions/logout";

const Settings = () => {
  const { data: session } = useSession({ required: true });

  const onClick = () => {
    logout();
  }

  return (
    <div>
      {JSON.stringify(session?.user)}
      <button onClick={onClick} type="submit">
        Sign Out
      </button>
    </div>
  )
}

export default Settings
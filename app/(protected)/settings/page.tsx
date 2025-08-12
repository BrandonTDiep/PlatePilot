"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";
const Settings = () => {
    const user = useCurrentUser();

    const onClick = () => {
      logout();
    }

    return (
        <div>
          {JSON.stringify(user)}
          <button onClick={onClick} type="submit">
            Sign Out
          </button>
        </div>
    )
}

export default Settings
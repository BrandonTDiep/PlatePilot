import { auth, signOut } from "@/auth"
const Settings = async() => {
    const session = await auth()
    return (
        <div>
            {JSON.stringify(session)}
            <form action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })

            }}>
                <button type="submit">
                    Sign Out
                </button>
                
            </form>
        </div>
    )
}

export default Settings
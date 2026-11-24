
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userName = session.user.name || "User";
    const userEmail = session.user.email || "";

    return (
        <DashboardClient
            userName={userName}
            userEmail={userEmail}
        />
    );
}

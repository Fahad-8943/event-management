
import { Suspense } from "react";
import { connection } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import DashboardClient from "./DashboardClient";

async function DashboardContent() {
    // Wait for an actual request before accessing runtime authentication data.
    await connection();

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

export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#F3EFE5] text-[#202A24] flex items-center justify-center">
                    <p className="text-sm opacity-60">
                        Loading dashboard...
                    </p>
                </main>
            }
        >
            <DashboardContent />
        </Suspense>
    );
}

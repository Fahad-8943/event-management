
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import EditEventClient from "./EditEventClient";

type EditEventPageProps = {
    params: Promise<{
        id: string;
    }>;
};

async function EditEventContent({
    params,
}: EditEventPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const { id } = await params;

    return <EditEventClient id={id} />;
}

export default function EditEventPage({
    params,
}: EditEventPageProps) {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#F3EFE5] text-[#202A24] flex items-center justify-center">
                    <p className="text-sm opacity-60">
                        Loading event...
                    </p>
                </main>
            }
        >
            <EditEventContent params={params} />
        </Suspense>
    );
}


"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

type EventStatus = "Upcoming" | "Completed" | "Cancelled";

type EventItem = {
    _id: string;
    name: string;
    description: string;
    date: string;
    venue: string;
    type: string;
    status: EventStatus;
};

type DashboardClientProps = {
    userName: string;
    userEmail: string;
};

export default function DashboardClient({
    userName,
    userEmail,
}: DashboardClientProps) {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/event");
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch events");
            }

            setEvents(result.data || []);
        } catch (error) {
            console.error("FETCH EVENTS ERROR:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to load events"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const searchTerm = search.toLowerCase();

            const matchesSearch =
                event.name.toLowerCase().includes(searchTerm) ||
                event.venue.toLowerCase().includes(searchTerm) ||
                event.type.toLowerCase().includes(searchTerm);

            const matchesFilter =
                filter === "All" || event.status === filter;

            return matchesSearch && matchesFilter;
        });
    }, [events, search, filter]);

    const upcoming = events.filter(
        (event) => event.status === "Upcoming"
    ).length;

    const completed = events.filter(
        (event) => event.status === "Completed"
    ).length;

    const cancelled = events.filter(
        (event) => event.status === "Cancelled"
    ).length;

    async function handleDelete() {
        if (!deleteId || deleting) return;

        try {
            setDeleting(true);

            const response = await fetch(`/api/event/${deleteId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete event");
            }

            setEvents((previous) =>
                previous.filter((event) => event._id !== deleteId)
            );

            setDeleteId(null);
            toast.success("Event deleted successfully");
        } catch (error) {
            console.error("DELETE EVENT ERROR:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to delete event"
            );
        } finally {
            setDeleting(false);
        }
    }

    async function handleLogout() {
        await signOut({ callbackUrl: "/login" });
    }

    function formatDate(date: string) {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <main className="min-h-screen bg-[#F3EFE5] text-[#202A24] flex">

            {/* Sidebar */}
            <aside className="hidden md:flex w-60 bg-[#202A24] text-[#F3EFE5] p-7 flex-col shrink-0">

                <Link
                    href="/dashboard"
                    className="text-3xl font-bold tracking-tight"
                >
                    gather<span className="text-[#D65A3A]">.</span>
                </Link>

                <nav className="mt-14">
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-5">
                        Menu
                    </p>

                    <Link
                        href="/dashboard"
                        className="block bg-[#D65A3A] text-[#202A24] px-4 py-3 rounded-md font-semibold"
                    >
                        Overview
                    </Link>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="text-sm hover:text-[#D65A3A] transition-colors"
                    >
                        Sign out →
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <section className="flex-1 min-w-0 p-5 md:p-10 lg:p-12">

                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 mb-10">

                    <div>
                        <Link
                            href="/dashboard"
                            className="md:hidden text-2xl font-bold mb-3 block"
                        >
                            gather<span className="text-[#D65A3A]">.</span>
                        </Link>

                        <p className="text-xs uppercase tracking-widest opacity-60">
                            Workspace
                        </p>

                        <h1 className="text-3xl md:text-4xl font-semibold mt-2">
                            Overview<span className="text-[#D65A3A]">.</span>
                        </h1>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-6">

                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#202A24] text-[#F3EFE5] flex items-center justify-center font-bold text-lg shrink-0">
                                {userName.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate max-w-36 md:max-w-40">
                                    {userName}
                                </p>

                                <p className="text-xs opacity-60 truncate max-w-36 md:max-w-40">
                                    {userEmail}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="md:hidden text-sm font-semibold whitespace-nowrap"
                        >
                            Sign out
                        </button>

                        <Link
                            href="/dashboard/add"
                            className="bg-[#D65A3A] text-[#202A24] px-4 md:px-5 py-3 rounded-md text-sm font-bold hover:bg-[#202A24] hover:text-[#F3EFE5] transition-colors whitespace-nowrap"
                        >
                            + New Event
                        </Link>
                    </div>
                </header>

                {/* Statistics */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">

                    <div className="bg-[#202A24] text-[#F3EFE5] p-6 rounded-lg">
                        <p className="text-sm opacity-70">Total Events</p>
                        <h2 className="text-4xl font-semibold mt-3">
                            {events.length}
                        </h2>
                    </div>

                    <div className="border border-[#202A24]/20 p-6 rounded-lg">
                        <p className="text-sm opacity-70">Upcoming</p>
                        <h2 className="text-4xl font-semibold mt-3">
                            {upcoming}
                        </h2>
                    </div>

                    <div className="border border-[#202A24]/20 p-6 rounded-lg">
                        <p className="text-sm opacity-70">Completed</p>
                        <h2 className="text-4xl font-semibold mt-3">
                            {completed}
                        </h2>
                    </div>

                </section>

                {/* Events */}
                <section>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                        <h2 className="text-2xl font-semibold">
                            All Events
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-3">

                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search events..."
                                className="bg-transparent border border-[#202A24]/30 px-4 py-3 rounded-md text-sm outline-none focus:border-[#D65A3A]"
                            />

                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-[#F3EFE5] border border-[#202A24]/30 px-4 py-3 rounded-md text-sm outline-none focus:border-[#D65A3A]"
                            >
                                <option value="All">All Status</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                        </div>
                    </div>

                    <div className="border-t border-[#202A24]/25">

                        {loading ? (
                            <div className="py-16 text-center opacity-60">
                                Loading events...
                            </div>
                        ) : filteredEvents.length === 0 ? (

                            <div className="py-16 text-center">

                                <p className="text-lg font-semibold">
                                    {events.length === 0
                                        ? "No events yet."
                                        : "No matching events."}
                                </p>

                                {events.length === 0 && (
                                    <Link
                                        href="/dashboard/add"
                                        className="inline-block mt-4 text-sm font-bold text-[#D65A3A] hover:underline"
                                    >
                                        + Create your first event
                                    </Link>
                                )}

                            </div>

                        ) : (

                            filteredEvents.map((event) => (

                                <article
                                    key={event._id}
                                    className="grid grid-cols-1 lg:grid-cols-[1fr_150px_120px_130px] gap-4 py-6 border-b border-[#202A24]/20 items-center"
                                >

                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-lg">
                                            {event.name}
                                        </h3>

                                        <p className="text-sm opacity-60 mt-1">
                                            {event.venue} · {event.type}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs opacity-50 uppercase tracking-wider">
                                            Date
                                        </p>

                                        <p className="text-sm font-semibold mt-1">
                                            {formatDate(event.date)}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-xs font-semibold border border-[#D65A3A] text-[#D65A3A] px-3 py-1.5 rounded-full">
                                            {event.status}
                                        </span>
                                    </div>

                                    <div className="flex gap-4 text-sm font-semibold">

                                        <Link
                                            href={`/dashboard/${event._id}`}
                                            className="hover:text-[#D65A3A]"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => setDeleteId(event._id)}
                                            className="text-[#D65A3A] hover:underline"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </article>

                            ))

                        )}

                    </div>

                    {cancelled > 0 && (
                        <p className="text-xs opacity-50 mt-4">
                            {cancelled} cancelled {cancelled === 1 ? "event" : "events"}
                        </p>
                    )}

                </section>

            </section>

            {/* Delete Confirmation */}
            {deleteId !== null && (

                <div className="fixed inset-0 z-50 bg-[#202A24]/80 flex items-center justify-center p-4">

                    <div className="bg-[#F3EFE5] rounded-lg p-7 max-w-sm w-full">

                        <h2 className="text-xl font-semibold">
                            Delete Event?
                        </h2>

                        <p className="text-sm mt-3 opacity-70">
                            Are you sure you want to delete this event? This action cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-7">

                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={deleting}
                                className="flex-1 border border-[#202A24]/30 py-3 rounded-md font-semibold disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 bg-[#D65A3A] text-[#202A24] py-3 rounded-md font-bold disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>
    );
}

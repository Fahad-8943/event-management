
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

type EventStatus = "Upcoming" | "Completed" | "Cancelled";

type EditEventClientProps = {
    id: string;
};

export default function EditEventClient({ id }: EditEventClientProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        description: "",
        date: "",
        venue: "",
        type: "",
        status: "Upcoming" as EventStatus,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch existing event
    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await fetch(`/api/event/${id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to fetch event"
                    );
                }

                const event = result.data;

                if (!event) {
                    throw new Error("Event not found");
                }

                setForm({
                    name: event.name || "",
                    description: event.description || "",
                    date: event.date
                        ? new Date(event.date).toISOString().split("T")[0]
                        : "",
                    venue: event.venue || "",
                    type: event.type || "",
                    status: event.status || "Upcoming",
                });
            } catch (error) {
                console.error("FETCH EVENT ERROR:", error);

                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Unable to load event"
                );

                router.replace("/dashboard");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchEvent();
        }
    }, [id, router]);

    // Handle form changes
    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    // Update event
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (saving) return;

        try {
            setSaving(true);

            const response = await fetch(`/api/event/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update event"
                );
            }

            toast.success("Event updated successfully!");

            router.push("/dashboard");
        } catch (error) {
            console.error("UPDATE EVENT ERROR:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update event"
            );
        } finally {
            setSaving(false);
        }
    }

    // Loading state
    if (loading) {
        return (
            <main className="min-h-screen bg-[#F3EFE5] text-[#202A24] flex items-center justify-center">
                <p className="text-sm opacity-60">
                    Loading event...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F3EFE5] text-[#202A24]">

            {/* Header */}
            <header className="bg-[#202A24] text-[#F3EFE5] px-6 md:px-12 py-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">

                    <Link
                        href="/dashboard"
                        className="text-3xl font-bold tracking-tight"
                    >
                        gather<span className="text-[#D65A3A]">.</span>
                    </Link>

                    <Link
                        href="/dashboard"
                        className="text-sm hover:text-[#D65A3A] transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>
            </header>

            {/* Edit Form */}
            <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">

                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D65A3A]">
                        Event Management
                    </p>

                    <h1 className="text-4xl font-semibold mt-3">
                        Edit Event<span className="text-[#D65A3A]">.</span>
                    </h1>

                    <p className="mt-3 text-sm opacity-70">
                        Update your event information.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Event Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold mb-2"
                        >
                            Event Name *
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            maxLength={100}
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter event name"
                            className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-semibold mb-2"
                        >
                            Description *
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            required
                            maxLength={2000}
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe your event..."
                            className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] transition-colors resize-none"
                        />
                    </div>

                    {/* Date and Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <div>
                            <label
                                htmlFor="date"
                                className="block text-sm font-semibold mb-2"
                            >
                                Event Date *
                            </label>

                            <input
                                id="date"
                                name="date"
                                type="date"
                                required
                                value={form.date}
                                onChange={handleChange}
                                className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] transition-colors"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="type"
                                className="block text-sm font-semibold mb-2"
                            >
                                Event Type *
                            </label>

                            <input
                                id="type"
                                name="type"
                                type="text"
                                required
                                maxLength={50}
                                value={form.type}
                                onChange={handleChange}
                                placeholder="e.g. Conference"
                                className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] transition-colors"
                            />
                        </div>

                    </div>

                    {/* Venue */}
                    <div>
                        <label
                            htmlFor="venue"
                            className="block text-sm font-semibold mb-2"
                        >
                            Venue *
                        </label>

                        <input
                            id="venue"
                            name="venue"
                            type="text"
                            required
                            maxLength={150}
                            value={form.venue}
                            onChange={handleChange}
                            placeholder="Enter event location"
                            className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] transition-colors"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-semibold mb-2"
                        >
                            Event Status
                        </label>

                        <select
                            id="status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full bg-[#F3EFE5] border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] transition-colors"
                        >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-[#D65A3A] text-[#202A24] font-bold py-4 rounded-md hover:bg-[#202A24] hover:text-[#F3EFE5] transition-colors disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Changes →"}
                        </button>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => router.push("/dashboard")}
                            className="flex-1 border border-[#202A24]/30 font-semibold py-4 rounded-md hover:bg-[#202A24] hover:text-[#F3EFE5] transition-colors disabled:opacity-60"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </section>
        </main>
    );
}

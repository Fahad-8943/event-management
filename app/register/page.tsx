
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleRegister = async (e: any) => {
        e.preventDefault();

        const name = userData.name.trim();
        const email = userData.email.trim().toLowerCase();
        const password = userData.password;

        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill the form completely");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must contain at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const serverResponse = await res.json();

            if (!res.ok) {
                toast.error(
                    serverResponse.message || "Registration failed"
                );
                return;
            }

            toast.success(serverResponse.message || "Registration successful");

            setUserData({
                name: "",
                email: "",
                password: "",
            });

            setConfirmPassword("");

            router.push("/login");

        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F3EFE5] text-[#202A24] flex">

            {/* Brand Section */}
            <section className="hidden lg:flex lg:w-[42%] bg-[#202A24] text-[#F3EFE5] p-14 flex-col justify-between">

                <Link href="/" className="text-3xl font-bold">
                    gather<span className="text-[#D65A3A]">.</span>
                </Link>

                <div>
                    <p className="text-sm uppercase tracking-[0.25em] mb-6">
                        A better way to organize
                    </p>

                    <h1 className="text-6xl font-semibold leading-[1.1] tracking-tight">
                        Every great
                        <br />
                        event starts
                        <br />
                        <span className="text-[#D65A3A]">somewhere.</span>
                    </h1>

                    <p className="mt-8 max-w-sm leading-relaxed opacity-75">
                        Create your space, plan your events and keep everything
                        running smoothly.
                    </p>
                </div>

                <p className="text-sm opacity-60">
                    © 2026 gather.
                </p>

            </section>

            {/* Registration Form */}
            <section className="flex-1 flex items-center justify-center px-6 py-12">

                <div className="w-full max-w-md">

                    <Link href="/" className="lg:hidden text-3xl font-bold">
                        gather<span className="text-[#D65A3A]">.</span>
                    </Link>

                    <div className="mt-10 lg:mt-0">

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D65A3A]">
                            Get started
                        </p>

                        <h2 className="text-4xl font-semibold tracking-tight mt-3">
                            Create account.
                        </h2>

                        <p className="mt-3 opacity-70">
                            Your next great event starts here.
                        </p>

                        <form
                            onSubmit={handleRegister}
                            className="mt-8 space-y-5"
                        >

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={userData.name}
                                    onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Your name"
                                    className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] placeholder:text-[#202A24]/40"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={userData.email}
                                    onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="you@example.com"
                                    className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] placeholder:text-[#202A24]/40"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={8}
                                        value={userData.password}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                password: e.target.value,
                                            })
                                        }
                                        placeholder="Minimum 8 characters"
                                        className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 pr-20 rounded-md outline-none focus:border-[#D65A3A] placeholder:text-[#202A24]/40"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#D65A3A]"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>

                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Confirm password
                                </label>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Re-enter your password"
                                    className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] placeholder:text-[#202A24]/40"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#D65A3A] text-[#202A24] font-bold py-4 rounded-md hover:bg-[#202A24] hover:text-[#F3EFE5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create account →"}
                            </button>

                        </form>

                        <p className="text-center mt-7 text-sm">
                            Already have an account?{" "}

                            <Link
                                href="/login"
                                className="text-[#D65A3A] font-bold hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>

                    </div>
                </div>
            </section>
        </main>
    );
}

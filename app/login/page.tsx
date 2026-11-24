
"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (e: any) => {
        e.preventDefault();

        if (loading) return;

        const email = userData.email.trim().toLowerCase();
        const password = userData.password;

        if (!email || !password) {
            toast.error("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const result = await signIn("credentials", {
                email,
                password,
                callbackUrl: "/dashboard",
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid email or password.");
                return;
            }

            if (result?.ok && result.url) {
                toast.success("Login successful!");
                window.location.href = result.url;
                return;
            }

            toast.error("Unable to sign in. Please try again.");
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F3EFE5] text-[#202A24] flex">
            {/* Left section */}
            <section className="hidden lg:flex lg:w-1/2 bg-[#202A24] text-[#F3EFE5] p-16 flex-col justify-between">
                <Link href="/" className="text-3xl font-bold tracking-tight">
                    gather<span className="text-[#D65A3A]">.</span>
                </Link>

                <div className="max-w-lg">
                    <p className="text-sm uppercase tracking-[0.25em] mb-6">
                        Your events. Your way.
                    </p>

                    <h1 className="text-6xl font-semibold leading-[1.1] tracking-tight">
                        Make room
                        <br />
                        for what
                        <br />
                        <span className="text-[#D65A3A]">matters.</span>
                    </h1>

                    <p className="mt-8 text-lg leading-relaxed opacity-80 max-w-md">
                        From the first idea to the final guest, keep every detail
                        of your events in one place.
                    </p>
                </div>

                <p className="text-sm opacity-60">
                    © 2026 gather. All rights reserved.
                </p>
            </section>

            {/* Login form */}
            <section className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <Link href="/" className="lg:hidden text-3xl font-bold">
                        gather<span className="text-[#D65A3A]">.</span>
                    </Link>

                    <div className="mt-12 lg:mt-0">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D65A3A]">
                            Welcome back
                        </p>

                        <h2 className="text-4xl font-semibold tracking-tight mt-3">
                            Sign in.
                        </h2>

                        <p className="mt-3 opacity-70">
                            Good to have you back. Let's get things organized.
                        </p>

                        <form onSubmit={handleLogin} className="mt-10 space-y-6">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={userData.email}
                                    onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="you@example.com"
                                    className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 rounded-md outline-none focus:border-[#D65A3A] transition-colors placeholder:text-[#202A24]/40"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="current-password"
                                        value={userData.password}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                password: e.target.value,
                                            })
                                        }
                                        placeholder="Enter your password"
                                        className="w-full bg-transparent border border-[#202A24]/30 px-4 py-3.5 pr-20 rounded-md outline-none focus:border-[#D65A3A] transition-colors placeholder:text-[#202A24]/40"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#D65A3A] font-semibold"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#D65A3A] text-[#202A24] font-bold py-4 rounded-md hover:bg-[#202A24] hover:text-[#F3EFE5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing in..." : "Sign in →"}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-sm">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="text-[#D65A3A] font-bold hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function LoginPage({ searchParams }: { searchParams: { message?: string; error?: string } }) {
	async function login(formData: FormData) {
		"use server";
		const email = String(formData.get("email") || "");
		const password = String(formData.get("password") || "");
		const supabase = await getSupabaseServerClient();
		const { error, data } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			redirect(`/login?error=${encodeURIComponent(error.message)}`);
		}
		
		// Check if user is admin and redirect accordingly
		if (data.user) {
			const { data: profile } = await supabase
				.from("profiles")
				.select("is_admin")
				.eq("id", data.user.id)
				.single();
			
			if (profile?.is_admin) {
				redirect("/admin");
			} else {
				redirect("/dashboard");
			}
		} else {
			redirect("/dashboard");
		}
	}

	return (
		<div className="max-w-md mx-auto py-10">
			<h1 className="text-2xl font-semibold mb-6">Login</h1>
			{searchParams.message && (
				<div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
					{searchParams.message}
				</div>
			)}
			{searchParams.error && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{searchParams.error}
				</div>
			)}
			<form action={login} className="space-y-4">
				<input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
				<input name="password" type="password" placeholder="Password" required className="w-full border rounded px-3 py-2" />
				<button type="submit" className="w-full bg-black text-white rounded px-4 py-2">Login</button>
			</form>
			<p className="mt-4 text-sm">
				No account? <Link href="/register" className="underline">Register</Link>
			</p>
			<p className="mt-2 text-sm">
				Forgot password? <Link href="/reset" className="underline">Reset</Link>
			</p>
		</div>
	);
}
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
	async function register(formData: FormData) {
		"use server";
		const name = String(formData.get("name") || "");
		const email = String(formData.get("email") || "");
		const password = String(formData.get("password") || "");
		const confirmPassword = String(formData.get("confirmPassword") || "");
		
		// Validate name
		if (!name.trim()) {
			redirect(`/register?error=${encodeURIComponent("Name is required")}`);
		}
		
		// Validate passwords match
		if (password !== confirmPassword) {
			redirect(`/register?error=${encodeURIComponent("Passwords do not match")}`);
		}
		
		// Validate password length
		if (password.length < 6) {
			redirect(`/register?error=${encodeURIComponent("Password must be at least 6 characters long")}`);
		}
		
		const supabase = await getSupabaseServerClient();
		const { error } = await supabase.auth.signUp({ 
			email, 
			password,
			options: {
				emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
				data: {
					name: name.trim()
				}
			}
		});
		
		if (error) {
			redirect(`/register?error=${encodeURIComponent(error.message)}`);
		}
		
		// Redirect to login page with success message
		redirect("/login?message=Check your email to confirm your account");
	}

	return (
		<div className="max-w-md mx-auto py-10">
			<h1 className="text-2xl font-semibold mb-6">Create Account</h1>
			{searchParams.error && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{searchParams.error}
				</div>
			)}
			<form action={register} className="space-y-4">
				<input 
					name="name" 
					type="text" 
					placeholder="Full Name" 
					required 
					className="w-full border rounded px-3 py-2" 
				/>
				<input 
					name="email" 
					type="email" 
					placeholder="Email" 
					required 
					className="w-full border rounded px-3 py-2" 
				/>
				<input 
					name="password" 
					type="password" 
					placeholder="Password" 
					required 
					minLength={6}
					className="w-full border rounded px-3 py-2" 
				/>
				<input 
					name="confirmPassword" 
					type="password" 
					placeholder="Confirm Password" 
					required 
					minLength={6}
					className="w-full border rounded px-3 py-2" 
				/>
				<button type="submit" className="w-full bg-black text-white rounded px-4 py-2">
					Create Account
				</button>
			</form>
			<p className="mt-4 text-sm">
				Already have an account? <Link href="/login" className="underline">Login</Link>
			</p>
		</div>
	);
}

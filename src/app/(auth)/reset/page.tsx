import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default function ResetPage() {
	async function sendReset(formData: FormData) {
		"use server";
		const email = String(formData.get("email") || "");
		const supabase = getSupabaseServerClient();
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${siteUrl}/reset/update`,
		});
		return { ok: true };
	}

	return (
		<div className="max-w-md mx-auto py-10">
			<h1 className="text-2xl font-semibold mb-6">Reset password</h1>
			<form action={sendReset} className="space-y-4">
				<input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
				<button type="submit" className="w-full bg-black text-white rounded px-4 py-2">Send reset link</button>
			</form>
			<p className="mt-4 text-sm">
				Remembered it? <Link href="/login" className="underline">Login</Link>
			</p>
		</div>
	);
}
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function ResetUpdatePage() {
	async function updatePassword(formData: FormData) {
		"use server";
		const password = String(formData.get("password") || "");
		const supabase = getSupabaseServerClient();
		const { error } = await supabase.auth.updateUser({ password });
		if (error) return { error: error.message };
		redirect("/login");
	}
	return (
		<div className="max-w-md mx-auto py-10">
			<h1 className="text-2xl font-semibold mb-6">Set new password</h1>
			<form action={updatePassword} className="space-y-4">
				<input name="password" type="password" placeholder="New password" required className="w-full border rounded px-3 py-2" />
				<button type="submit" className="w-full bg-black text-white rounded px-4 py-2">Update password</button>
			</form>
		</div>
	);
}
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ContactMessagesTable from "@/components/admin-contact-messages";

export default async function AdminContactPage() {
  const supabase = await getSupabaseServerClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  // Fetch contact messages
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact messages:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Contact Messages</h1>
          <p className="text-sm text-gray-600">
            Messages submitted through the contact form
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {messages?.length || 0} total messages
        </div>
      </div>

      <ContactMessagesTable messages={messages || []} />
    </div>
  );
}

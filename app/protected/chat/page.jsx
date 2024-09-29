// import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
// import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Chat from "@/components/gatherly/Chat/Chat.jsx";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  /*
  Temporary Gatherly profile record creation code while the profile creation functionality is not yet implemented
  */
  // Check if the user has a profile
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(
      "Error checking if profile exists (Gatherly temporary profile creation code):",
      error,
    );
  }

  // If the user does not have a profile, create a temporary one
  if (profiles.length === 0) {
    const { error } = await supabase.from("profiles").insert([
      {
        user_id: user.id,
        display_name:
          "New user " +
          user.id.substring(0, 6) +
          " (temporary display name until profile creation is implemented)",
      },
    ]);

    if (error) {
      console.error(
        "Error creating profile (Gatherly temporary profile creation code):",
        error,
      );
    }
  }

  /*
  End of temporary Gatherly profile record creation code
  */

  return (
    <>
      <Chat userId={user.id} />
    </>
  );

  /*   return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  ); */
}

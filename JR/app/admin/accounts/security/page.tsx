import { getCurrentEmail } from "./actions";
import SecurityForm from "@/components/admin/SecurityForm";

export default async function AccountSecurityPage() {
  const email = await getCurrentEmail();

  return <SecurityForm currentEmail={email ?? ""} />;
}

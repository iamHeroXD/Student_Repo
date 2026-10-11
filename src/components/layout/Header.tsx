import { getCurrentSession } from "@/lib/auth/session";
import { HeaderNav } from "./HeaderNav";
import { MobileBottomNav } from "./MobileBottomNav";

export async function Header() {
  const session = await getCurrentSession();
  const sessionData = session
    ? { username: session.username, role: session.role, fullName: session.fullName }
    : null;

  return (
    <>
      <HeaderNav session={sessionData} />
      <MobileBottomNav session={sessionData} />
    </>
  );
}

import { getCurrentSession } from "@/lib/auth/session";
import { HeaderNav } from "./HeaderNav";

export async function Header() {
  const session = await getCurrentSession();

  return (
    <HeaderNav 
      session={
        session 
          ? { username: session.username, role: session.role, fullName: session.fullName } 
          : null
      } 
    />
  );
}

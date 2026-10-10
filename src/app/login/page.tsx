import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log In",
  description: "Sign in with your username to access Student_Repo personal features.",
};

export default function LoginPage() {
  return <LoginForm isTeacher={false} />;
}

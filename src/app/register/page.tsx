import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Student Account",
  description: "Join Student_Repo with a username and password. No email required.",
};

export default function RegisterPage() {
  return <RegisterForm isTeacher={false} />;
}

import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Teacher Portal Log In",
  description: "Educator login for managing notes, records, and student analytics.",
};

export default function TeacherLoginPage() {
  return <LoginForm isTeacher={true} />;
}

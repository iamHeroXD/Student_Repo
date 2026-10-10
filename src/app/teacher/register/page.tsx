import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Teacher Registration",
  description: "Create an educator account to contribute verified study materials across Kerala.",
};

export default function TeacherRegisterPage() {
  return <RegisterForm isTeacher={true} />;
}

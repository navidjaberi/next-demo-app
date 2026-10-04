import AuthForm from "./AuthForm";
import OwnerForm from "./OwnerForm";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }) {
  const { next = "", mode = "" } = await searchParams;

  if (mode === "owner") {
    return <OwnerForm />;
  }

  return <AuthForm next={next} startWithSignup={mode === "signup"} />;
}

import AuthForm from "./AuthForm";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }) {
  const { next = "", mode = "" } = await searchParams;

  return <AuthForm next={next} startWithSignup={mode === "signup"} />;
}

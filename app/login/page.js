import AuthForm from "./AuthForm";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }) {
  const { next = "" } = await searchParams;

  return <AuthForm next={next} />;
}

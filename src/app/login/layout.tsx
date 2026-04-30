import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke dashboard AI Trading Hub Anda untuk mengakses intelijen pasar eksklusif.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

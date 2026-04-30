import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Pelajari bagaimana IUS Platform melindungi data Anda dan menjaga privasi informasi keuangan Anda.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun Baru",
  description: "Bergabunglah dengan ribuan trader cerdas lainnya dan dapatkan akses ke sinyal trading AI terbaik di Indonesia.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

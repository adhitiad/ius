import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description: "Ketentuan layanan penggunaan platform IUS, tanggung jawab pengguna, dan batasan operasional sistem.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

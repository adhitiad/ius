import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Trading Hub",
  description:
    "Kebijakan Privasi AI Trading Hub - Platform Intelijen Pasar & Sinyal Trading",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight font-outfit text-white">
              Privacy Policy
            </h1>
            <p className="text-zinc-400">
              Terakhir diperbarui:{" "}
              {new Date().toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Introduction */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">Pendahuluan</h2>
            <p className="text-zinc-300 leading-relaxed">
              AI Trading Hub ("kami", "kita", atau "milik kita") berkomitmen
              untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan
              bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi
              yang Anda berikan saat menggunakan platform kami di{" "}
              <Link
                href="https://aitradinghub.com"
                className="text-blue-400 hover:underline"
              >
                aiuiso.site
              </Link>{" "}
              (selanjutnya disebut "Layanan").
            </p>
          </Card>

          {/* Information Collection */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Informasi yang Kami Kumpulkan
            </h2>
            <div className="space-y-4 text-zinc-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Informasi Akun
                </h3>
                <p className="leading-relaxed">
                  Saat Anda mendaftar, kami mengumpulkan nama, alamat email, dan
                  kata sandi terenkripsi. Untuk pengguna premium, kami juga
                  dapat mengumpulkan informasi pembayaran yang diproses melalui
                  penyedia pembayaran pihak ketiga yang aman.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Data Pasar & Trading
                </h3>
                <p className="leading-relaxed">
                  Kami mengumpulkan data terkait aktivitas trading Anda,
                  termasuk sinyal yang diterima, backtest yang dijalankan, dan
                  preferensi portofolio untuk memberikan layanan yang
                  dipersonalisasi.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Informasi Teknis
                </h3>
                <p className="leading-relaxed">
                  Kami mengumpulkan alamat IP, jenis peramban, sistem operasi,
                  dan informasi perangkat lainnya untuk keperluan keamanan dan
                  peningkatan layanan.
                </p>
              </div>
            </div>
          </Card>

          {/* How We Use Information */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Bagaimana Kami Menggunakan Informasi Anda
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Menyediakan dan memelihara Layanan kami</li>
              <li>Mengirimkan sinyal trading dan analisis pasar</li>
              <li>Memproses transaksi pembayaran untuk layanan premium</li>
              <li>Mengirimkan notifikasi penting terkait akun dan pasar</li>
              <li>Meningkatkan algoritma AI dan akurasi sinyal</li>
              <li>Mematuhi kewajiban hukum yang berlaku</li>
            </ul>
          </Card>

          {/* Data Security */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Keamanan Data
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi
              yang sesuai untuk melindungi informasi Anda. Password dienkripsi
              menggunakan bcrypt, token autentikasi menggunakan JWT dengan
              enkripsi HS256, dan semua komunikasi data menggunakan protokol
              HTTPS. Namun, tidak ada metode transmisi internet atau penyimpanan
              elektronik yang 100% aman.
            </p>
          </Card>

          {/* Cookies */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Cookies & Pelacakan
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami menggunakan cookies untuk menjaga sesi login Anda dan
              mengingat preferensi tema (dark/light mode). Kami juga menggunakan
              layanan analitik untuk memahami penggunaan platform guna
              meningkatkan layanan. Anda dapat mengatur preferensi cookies
              melalui pengaturan peramban Anda.
            </p>
          </Card>

          {/* Third Party Services */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Layanan Pihak Ketiga
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Kami menggunakan layanan pihak ketiga berikut:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Resend - untuk pengiriman email notifikasi</li>
              <li>
                Penyedia pembayaran (********) - untuk pemrosesan langganan
                premium
              </li>
              <li>
                Penyedia data pasar - untuk feed harga real-time dan analisis
                teknikal
              </li>
            </ul>
          </Card>

          {/* Your Rights */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">Hak Anda</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Sesuai dengan peraturan perlindungan data pribadi, Anda memiliki
              hak untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Mengakses dan memperbarui informasi akun Anda</li>
              <li>Meminta penghapusan akun dan data pribadi Anda</li>
              <li>
                Menarik persetujuan pemrosesan data (dengan batasan tertentu)
              </li>
              <li>
                Menerima salinan data pribadi Anda dalam format yang dapat
                dibaca
              </li>
            </ul>
          </Card>

          {/* Contact */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">Hubungi Kami</h2>
            <p className="text-zinc-300 leading-relaxed">
              Jika Anda memiliki pertanyaan terkait Kebijakan Privasi ini,
              silakan hubungi kami di:{" "}
              <a
                href="mailto:privacy@aiuiso.site"
                className="text-blue-400 hover:underline"
              >
                privacy@aiuiso.site
              </a>
            </p>
          </Card>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-400 hover:underline font-medium"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

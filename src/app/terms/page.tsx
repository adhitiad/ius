import DateDisplay from "@/components/DateDisplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ketentuan Umum | AI Trading Hub",
  description:
    "Ketentuan Umum AI Trading Hub - Platform Intelijen Pasar & Sinyal Trading",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight font-outfit text-white">
              Ketentuan Umum
            </h1>
            <p className="text-zinc-400">
              Terakhir diperbarui: <DateDisplay />
            </p>
          </div>

          {/* Introduction */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Pendahuluan</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p className="text-zinc-300 leading-relaxed">
                  Dengan mengakses dan menggunakan platform AI Trading Hub
                  ("Layanan"), Anda setuju untuk mematuhi dan terikat oleh
                  Ketentuan Umum ini. Jika Anda tidak setuju dengan ketentuan
                  ini, mohon untuk tidak menggunakan Layanan kami.
                </p>
              </CardDescription>
            </CardContent>
          </Card>

          {/* User Agreement */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Perjanjian Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p className="text-zinc-300 leading-relaxed">
                  Dengan menggunakan Layanan kami, Anda setuju untuk tidak
                  melakukan tindakan yang dapat merugikan, mengganggu, atau
                  membatasi penggunaan Layanan oleh pengguna lain. Anda juga
                  setuju untuk tidak menggunakan Layanan kami untuk tujuan
                  ilegal atau tidak sah.
                </p>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Definitions */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Definisi</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <div className="space-y-3 text-zinc-300">
                  <p>
                    <strong className="text-white">"Layanan"</strong> mengacu
                    pada platform AI Trading Hub, termasuk website, API, dan
                    aplikasi terkait.
                  </p>
                  <p>
                    <strong className="text-white">"Pengguna"</strong> mengacu
                    pada individu atau entitas yang mengakses atau menggunakan
                    Layanan.
                  </p>
                  <p>
                    <strong className="text-white">"Sinyal Trading"</strong>{" "}
                    mengacu pada rekomendasi jual/beli yang dihasilkan oleh
                    algoritma AI kami.
                  </p>
                  <p>
                    <strong className="text-white">"Konten"</strong> mencakup
                    semua informasi, data, analisis, dan materi yang tersedia
                    dalam Layanan.
                  </p>
                </div>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Deskripsi Layanan</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p className="text-zinc-300 leading-relaxed mb-4">
                  AI Trading Hub menyediakan platform intelijen pasar yang
                  mencakup:
                </p>
              </CardDescription>
            </CardContent>
          </Card>

          {/* Trading Solutions */}

          <Card>
            <CardHeader>
              <CardTitle>Solusi Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p className="text-zinc-300 leading-relaxed mb-4">
                  AI Trading Hub menyediakan berbagai solusi trading untuk
                  memenuhi kebutuhan Anda:
                </p>
                <ul className="list-disc list-inside space-y-2 text-zinc-300">
                  <li>Sinyal trading otomatis berbasis AI</li>
                  <li>Analisis teknikal dan fundamental</li>
                  <li>Backtesting strategi trading</li>
                  <li>Data pasar real-time</li>
                  <li>Chat dengan analis AI</li>
                </ul>
              </CardDescription>
            </CardContent>
          </Card>

          {/* User Obligations */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Kewajiban Pengguna
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>
                Memberikan informasi yang akurat dan terkini saat pendaftaran
              </li>
              <li>Menjaga kerahasiaan kredensial akun Anda</li>
              <li>Menggunakan Layanan sesuai dengan hukum yang berlaku</li>
              <li>
                Tidak menyalahgunakan, meretas, atau mengganggu integritas
                Layanan
              </li>
              <li>
                Tidak mendistribusikan Konten tanpa izin tertulis dari kami
              </li>
            </ul>
          </Card>

          {/* Disclaimer */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Penyangkalan (Disclaimer)
            </h2>
            <div className="space-y-4 text-zinc-300">
              <p className="font-semibold text-yellow-200">
                TRADING MELIBATKAN RISIKO TINGGI. SINYAL YANG DIHASILKAN OLEH AI
                BUKANLAH JAMINAN KEUNTUNGAN.
              </p>
              <p>
                <strong className="text-white">Risiko Investasi:</strong> Anda
                menyadari bahwa trading saham, kripto, dan instrumen keuangan
                lainnya melibatkan risiko kerugian. Kinerja masa lalu tidak
                menjamin hasil di masa depan.
              </p>
              <p>
                <strong className="text-white">Konten Edukasi:</strong> Semua
                analisis, sinyal, dan rekomendasi yang disediakan adalah untuk
                tujuan edukasi dan informasi saja, bukan saran investasi
                profesional.
              </p>
              <p>
                <strong className="text-white">Keputusan Mandiri:</strong> Anda
                bertanggung jawab penuh atas keputusan trading Anda. Kami tidak
                bertanggung jawab atas kerugian finansial yang Anda alami.
              </p>
            </div>
          </Card>

          {/* Intellectual Property */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Kekayaan Intelektual
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Semua hak kekayaan intelektual terkait Layanan, termasuk namun
              tidak terbatas pada algoritma AI, kode sumber, desain, logo, dan
              Konten, adalah milik eksklusif AI Trading Hub. Pengguna dilarang
              menyalin, memodifikasi, mendistribusikan, atau membuat karya
              turunan tanpa izin tertulis.
            </p>
          </Card>

          {/* Limitation of Liability */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Batasan Tanggung Jawab
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Sejauh diizinkan oleh hukum, AI Trading Hub tidak akan bertanggung
              jawab atas kerugian langsung, tidak langsung, insidental, khusus,
              atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan
              menggunakan Layanan, termasuk namun tidak terbatas pada kerugian
              finansial, kehilangan data, atau gangguan bisnis.
            </p>
          </Card>

          {/* Termination */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">Pengakhiran</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami berhak menghentikan atau menangguhkan akun Anda tanpa
              pemberitahuan sebelumnya jika Anda melanggar Ketentuan Umum ini.
              Anda dapat mengakhiri akun Anda kapan saja melalui pengaturan akun
              atau dengan menghubungi tim dukungan kami.
            </p>
          </Card>

          {/* Changes to Terms */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">
              Perubahan Ketentuan
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami dapat memperbarui Ketentuan Umum ini dari waktu ke waktu.
              Perubahan akan diberitahukan melalui email atau notifikasi dalam
              aplikasi. Penggunaan Layanan yang berkelanjutan setelah perubahan
              merupakan persetujuan Anda terhadap ketentuan yang baru.
            </p>
          </Card>

          {/* Contact */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-4">Hubungi Kami</h2>
            <p className="text-zinc-300 leading-relaxed">
              Jika Anda memiliki pertanyaan terkait Ketentuan Umum ini, silakan
              hubungi kami di:{" "}
              <Link
                href="mailto:legal@aiuiso.site"
                className="text-blue-400 hover:underline"
              >
                legal@aiuiso.site
              </Link>
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

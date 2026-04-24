export const id = {
  navigation: {
    dashboard: "Dashboard",
    screener: "Screener",
    backtester: "Backtester",
    signals: "Sinyal",
    admin_panel: "Panel Admin",
    settings: "Pengaturan",
    profile: "Profil",
    billing: "Tagihan",
    finances: "Keuangan",
  },
  common: {
    save: "Simpan",
    saving: "Menyimpan...",
    loading: "Memuat...",
    language: "Bahasa",
    back_to_dashboard: "Kembali ke Dashboard",
  },
  profile: {
    title: "Pengaturan Profil",
    subtitle: "Kelola informasi pribadi dan integrasi notifikasi Anda.",
    full_name: "Nama Lengkap",
    email: "Alamat Email",
    telegram_id: "Telegram ID",
    email_help: "Email tidak dapat diubah (digunakan untuk otentikasi).",
    telegram_help: "Digunakan untuk mengirim alert sinyal ke akun Telegram Anda via @userinfobot.",
    success: "Profil Anda berhasil diperbarui!",
    error: "Gagal menyimpan data.",
  },
  admin: {
    users_title: "Manajemen Pengguna",
    finances_title: "Manajemen Keuangan",
    table: {
      name: "Nama",
      plan: "Plan",
      role: "Role",
      telegram_id: "Telegram ID",
      date: "Tanggal",
      description: "Deskripsi",
      type: "Tipe",
      amount: "Nominal",
      category: "Kategori",
      status: "Status",
      income: "Pemasukan",
      expense: "Pengeluaran",
    }
  }
};

export type Dictionary = typeof id;

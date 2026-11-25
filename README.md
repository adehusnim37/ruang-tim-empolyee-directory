# Ruang Tim

Aplikasi frontend untuk melihat, mencari, dan menambahkan data karyawan. Direktori dimulai dengan 120 data contoh.

## Environment

- Angular 22 dan TypeScript 6.
- Node.js 26.13.0.
- npm dan browser modern.

## Cara menjalankan

Jalankan dari folder proyek.

```sh
npm ci
npm start
```

Buka [http://localhost:4200](http://localhost:4200). Masuk dengan username `admin` dan kata sandi `admin123`.

Untuk menghasilkan build produksi, jalankan `npm run build`. Hasilnya berada di `dist/employee-directory/browser/`. Jika disajikan pada hosting statis, atur fallback rute aplikasi ke `index.html`.

## Alur demo

1. Masuk dengan akun demo.
2. Isi nama atau username dan pilih grup, lalu klik **Cari**. Jika keduanya terisi, karyawan harus memenuhi kedua filter. Klik judul kolom untuk mengurutkan dan gunakan kontrol di bawah tabel untuk mengganti halaman atau jumlah baris.
3. Klik nama karyawan untuk membuka detail, lalu klik **OK** untuk kembali dengan filter, urutan, dan halaman yang sama.
4. Klik **Tambah karyawan**, isi semua kolom, lalu simpan. Cari grup pada kolom **Cari grup** dan pilih hasilnya di dropdown **Grup**.
5. Tombol **Edit** dan **Delete** mensimulasikan aksi dengan notifikasi masing-masing berwarna kuning dan merah.

Login demo menggunakan `sessionStorage`. Data baru disimpan di `localStorage` browser yang sama dan tetap tersedia setelah refresh. Daftar menyimpan filter, urutan, dan halaman di URL. Field `description` menyimpan tanggal dan waktu sesuai skema assessment.

## Struktur kode

- `src/app/app.routes.ts` mendefinisikan halaman dan aturan akses login.
- `src/app/pages/` berisi komponen dan template tiap halaman.
- `src/app/data/` berisi akun demo, model karyawan, data awal, dan penyimpanan.

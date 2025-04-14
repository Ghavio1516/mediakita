import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="logo">
        {/* Membungkus gambar logo dengan Link untuk mengarah ke halaman utama */}
        <Link href="/">
          {/* Hapus <a> di dalam Link */}
          <img src="/mediakitalogo.png" alt="Media Kita Logo" />
        </Link>
      </div>
      <nav>
        {/* Membungkus link "Home" dengan Link untuk navigasi */}
        <Link href="/">
          {/* Hapus <a> di dalam Link */}
          <span className="active">Home</span>
        </Link>
        <Link href="/news">
          <span>Hot News</span>
        </Link>
        <Link href="/pricelist">
          <span>Price List</span>
        </Link>
        <a href="#">Entertainment</a>
      </nav>
    </header>
  );
}

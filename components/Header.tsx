import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div className="logo">
        {/* Membungkus gambar logo dengan Link untuk mengarah ke halaman utama */}
        <Link href="/">
          <a>
            <img src="/mediakitalogo.png" alt="Media Kita Logo" />
          </a>
        </Link>
      </div>
      <nav>
        {/* Membungkus link "Home" dengan Link untuk navigasi */}
        <Link href="/">
          <a className="active">Home</a>
        </Link>
        <a href="#">Hot News</a>
        <a href="#">Entertainment</a>
      </nav>
    </header>
  );
}

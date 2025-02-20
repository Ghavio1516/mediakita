export default function Header() {
    return (
      <header>
        <div className="logo">
          <img src="/mediakitalogo.png" alt="Media Kita Logo" />
        </div>
        <nav>
          <a href="#" className="active">Home</a>
          <a href="#">Hot News</a>
          <a href="#">Entertainment</a>
        </nav>
      </header>
    );
  }
  
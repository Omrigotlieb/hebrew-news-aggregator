import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'חדשות ישראל | Hebrew News Aggregator',
  description: 'כל החדשות ממקור אחד - Ynet, N12 ועוד',
  keywords: ['חדשות', 'ישראל', 'ynet', 'n12', 'news', 'israel'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <header className="header">
          <div className="container header-content">
            <div className="logo">
              <span className="logo-icon">📰</span>
              <span>חדשות ישראל</span>
            </div>
            <nav className="nav">
              <a href="/" className="nav-link active">ראשי</a>
              <a href="/?category=breaking" className="nav-link">מבזקים</a>
              <a href="/?category=politics" className="nav-link">פוליטי</a>
              <a href="/?category=economy" className="nav-link">כלכלה</a>
              <a href="/?category=sports" className="nav-link">ספורט</a>
              <a href="/?category=tech" className="nav-link">טכנולוגיה</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container">
            <p>מחובר לאתרי החדשות המובילים בישראל | לא קשור רשמית ל-Ynet או N12</p>
            <p style={{ marginTop: '0.5rem' }}>נבנה עם ❤️ לקריאה נוחה יותר</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

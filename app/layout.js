import "./globals.css";

export const metadata = {
  title: "CrackAI - Crack Every Interview with Real-Time AI",
  description: "Your personal AI assistant to practice, improve, and succeed in interviews.",
};

import DesktopSettingsBar from "../components/DesktopSettingsBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DesktopSettingsBar />
        {children}
      </body>
    </html>
  );
}

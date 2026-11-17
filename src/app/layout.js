import "./globals.css";

export const metadata = {
  title: "Credential-to-Cloud | Security overview",
  description: "Local cybersecurity research prototype using synthetic credential and event data.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

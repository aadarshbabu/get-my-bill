import { Footer } from "@/templates/Footer";
import { Navbar } from "@/templates/Navbar";

// app/[locale]/unauth/layout.tsx
export default function UnauthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <>{children}</>
      <Footer />
    </div>
  );
}

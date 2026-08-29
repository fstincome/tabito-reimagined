import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Newsletter } from "./Newsletter";
import { TopBar } from "./TopBar";

export function SiteLayout({
  children,
  hideNewsletter = false,
}: {
  children: ReactNode;
  hideNewsletter?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideNewsletter && <Newsletter />}
      <Footer />
    </div>
  );
}

import { ReactNode } from "react";
import CareersHeader from "./CareersHeader";
import CareersFooter from "./CareersFooter";

interface CareersLayoutProps {
  children: ReactNode;
}

export default function CareersLayout({ children }: CareersLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <CareersHeader />
      <main className="flex-grow">
        {children}
      </main>
      <CareersFooter />
    </div>
  );
}
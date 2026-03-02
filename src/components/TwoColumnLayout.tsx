import Sidebar from "./Sidebar";

interface TwoColumnLayoutProps {
  children: React.ReactNode;
}

export default function TwoColumnLayout({ children }: TwoColumnLayoutProps) {
  return (
    <section className="py-16 bg-[#FFFDF5]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16 items-start">
          <div className="space-y-6">{children}</div>
          <Sidebar />
        </div>
      </div>
    </section>
  );
}

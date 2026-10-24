import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingSocials } from "@/components/layout/FloatingSocials";
import { getNavServices } from "@/lib/site-api";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const services = await getNavServices();
  return (
    <>
      <Navbar services={services} />
      <main className="flex-1 pt-36 md:pt-40">{children}</main>
      <Footer services={services} />
      <FloatingSocials />
    </>
  );
}

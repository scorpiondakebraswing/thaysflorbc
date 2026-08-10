import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Procedures from "@/components/Procedures";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ClubBadge from "@/components/ClubBadge";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Hero />
      <About />
      <Procedures />
      <Testimonials />
      <Footer />
      <ClubBadge />
    </main>
  );
}

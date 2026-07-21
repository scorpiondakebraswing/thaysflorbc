import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Procedures from "@/components/Procedures";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <Hero />
      <About />
      <Procedures />
      <Footer />
    </main>
  );
}

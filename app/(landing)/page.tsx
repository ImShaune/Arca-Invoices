import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { HowItWorks } from "./_components/how-it-works";
import { Pricing } from "./_components/pricing";
import { Footer } from "./_components/footer";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <Footer />
        </main>
    );
}
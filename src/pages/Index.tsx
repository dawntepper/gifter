import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GiftForm from "@/components/GiftForm";
import GiftRecommendations from "@/components/GiftRecommendations";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            <section className="bg-white rounded-lg shadow-sm p-8">
              <GiftForm />
            </section>
            <section className="bg-white rounded-lg shadow-sm p-8">
              <GiftRecommendations />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
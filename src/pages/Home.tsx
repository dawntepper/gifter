import GiftForm from "@/components/GiftForm";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    console.log("Home component mounted");
    return () => console.log("Home component unmounted");
  }, []);

  return (
    <div className="w-full bg-background">
      <section className="space-y-8">
        <GiftForm />
        <Separator className="my-8" />
      </section>
    </div>
  );
};

export default Home;
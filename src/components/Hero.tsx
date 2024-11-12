const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary py-8 sm:py-12">
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-grid-16" />
      <div className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Discover the Perfect Gift, Powered by AI
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
              Our intelligent gift assistant analyzes your input to uncover unique, thoughtful presents that will delight your loved ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
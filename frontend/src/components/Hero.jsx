import { useState } from "react";
import { MapPin, Search } from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a service you're looking for");
      return;
    }
    if (!location.trim()) {
      alert("Please enter your location");
      return;
    }
    alert(`Searching for ${searchQuery} providers near ${location}...`);
    const section = document.getElementById("providers-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`
          );
          alert("Location detected successfully!");
        },
        () => {
          alert("Unable to detect location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden 
                 ml-[-50vw] left-[50%] w-screen"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-500 to-yellow-400 animate-[bgFlow_18s_ease_infinite] z-0" />

      {/* Radial Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none z-10" />

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-7xl px-6 md:px-12 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Find Local
          <br />
          <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
            Service Providers
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl">
          Trusted professionals for all your home and business needs.
          From plumbing to painting, we've got you covered.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Service Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
              <input
                type="text"
                placeholder="What service do you need?"
                className="pl-12 pr-4 h-14 w-full bg-white/20 border border-white/30 text-white placeholder:text-white/70 text-lg rounded-lg focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 relative">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors cursor-pointer"
                onClick={getCurrentLocation}
                title="Use current location"
              />
              <input
                type="text"
                placeholder="Enter your location"
                className="pl-12 pr-4 h-14 w-full bg-white/20 border border-white/30 text-white placeholder:text-white/70 text-lg rounded-lg focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Search Button */}
            <button
              className="h-14 px-8 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition duration-200"
              onClick={handleSearch}
            >
              Find Services
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm sm:text-base">
          {["1000+ Verified Providers", "24/7 Customer Support", "Instant Booking"].map(
            (text, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                <span>{text}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Floating Glow Effects */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-pulse delay-1000" />
    </section>
  );
};

export default Hero;

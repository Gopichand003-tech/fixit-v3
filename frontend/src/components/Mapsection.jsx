import { useState, useCallback } from "react";
import { MapPin, Navigation, Filter } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";

// Keep this OUTSIDE component
const libraries = ["places"];

const MapSection = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Services");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const services = ["All Services", "Plumbing", "Electrical", "Handyman", "Cleaning", "Painting"];

  const providers = [
    { id: 1, name: "Mike's Plumbing Pro", type: "Plumbing", lat: 17.385044, lng: 78.486671, rating: 4.9 },
    { id: 2, name: "Elite Electrical", type: "Electrical", lat: 17.395044, lng: 78.476671, rating: 4.8 },
    { id: 3, name: "QuickFix Handyman", type: "Handyman", lat: 17.375044, lng: 78.496671, rating: 4.9 },
  ];

  const filteredProviders =
    selectedFilter === "All Services"
      ? providers
      : providers.filter((p) => p.type === selectedFilter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, // ✅ static variable
  });

  const handleFilterClick = (service) => setSelectedFilter(service);

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => alert("Unable to detect location.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const center = userLocation || { lat: 17.385044, lng: 78.486671 };

  const containerStyle = { width: "100%", height: "100%" };

  const onLoad = useCallback((map) => map.setZoom(13), []);

  return (
    <section className="w-screen bg-gradient-to-br from-blue-100 to-yellow-100 py-26 px-16 md:px-14 overflow-x-hidden relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Heading */}
      <div className="text-center py-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-2">Find Nearby Service shops on the Map</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Visualize service providers in your area and get directions to their locations.
        </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="lg:w-1/4 w-full space-y-6 overflow-auto pb-4 pl-4"> {/* ✅ Added left padding */}
          <div className="bg-white rounded-none lg:rounded-r-xl shadow p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Services
            </h3>
            <div className="space-y-2">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => handleFilterClick(service)}
                  className={`w-full text-left px-4 py-2 rounded-lg border text-sm ${
                    selectedFilter === service
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-none lg:rounded-r-xl shadow p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Your Location
            </h3>
            <button
              onClick={handleUseLocation}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm"
            >
              <MapPin className="h-4 w-4" />
              Use Current Location
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="lg:w-3/4 w-full overflow-hidden">
          <div className="bg-white rounded-none lg:rounded-l-xl shadow h-full w-full flex flex-col relative">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onLoad={onLoad}
              >
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                  />
                )}

                {filteredProviders.map((provider) => (
                  provider.lat && provider.lng && (
                    <Marker
                      key={provider.id}
                      position={{ lat: provider.lat, lng: provider.lng }}
                      onClick={() => setSelectedProvider(provider)}
                    />
                  )
                ))}

                {selectedProvider && (
                  <InfoWindow
                    position={{ lat: selectedProvider.lat, lng: selectedProvider.lng }}
                    onCloseClick={() => setSelectedProvider(null)}
                  >
                    <div>
                      <h3 className="font-semibold">{selectedProvider.name}</h3>
                      <p>Type: {selectedProvider.type}</p>
                      <p>Rating: ⭐ {selectedProvider.rating}</p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${selectedProvider.lat},${selectedProvider.lng}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Get Directions
                      </a>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <p className="text-center mt-20">Loading Map...</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;

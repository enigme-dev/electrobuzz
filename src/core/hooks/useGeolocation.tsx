import { useEffect, useState } from "react";
import { useToast } from "../components/ui/use-toast";

interface GeoLocation {
  latLng: string;
  error: string | null;
}

export const useGeoLocation = (): GeoLocation => {
  const [latLng, setLatLng] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onGeoSuccess = (position: GeolocationPosition) => {
    setLatLng(`${position.coords.latitude},${position.coords.longitude}`);
  };

  const onGeoError = () => {
    setError("Unable to retrieve location");
    toast({
      description: "Unable to retrieve location",
      variant: "destructive",
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      toast({
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    } else {
      navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
    }
  }, []);

  return { latLng, error };
};

import { useState, useCallback } from "react";

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | locating | done | error
  const [error, setError] = useState("");

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported by this browser.");
      setStatus("error");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("done");
      },
      () => {
        setError("Couldn't get your location. Check location permissions.");
        setStatus("error");
      }
    );
  }, []);

  return { coords, status, error, locate };
}

import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function FreteGratisBar() {
  const [location] = useLocation();
  const [cidade, setCidade] = useState<string | null>(null);
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    let cancelled = false;
    let watchId: number | null = null;
    let gpsTimer: ReturnType<typeof setTimeout> | null = null;
    let bestPosition: GeolocationPosition | null = null;
    let locationFinished = false;

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    setDeadline(`${hh}:${mm}`);

    // Usa o IP somente como fallback, depois que o GPS não for autorizado
    // ou não conseguir determinar a localização.
    function fetchByIp() {
      fetch("https://ipapi.co/json/")
        .then(r => r.json())
        .then(d => { if (!cancelled && d.city) setCidade(d.city); })
        .catch(() => {});
    }

    function stopGpsWatch() {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (gpsTimer !== null) clearTimeout(gpsTimer);
      watchId = null;
      gpsTimer = null;
    }

    function reverseGeocode(pos: GeolocationPosition) {
      const { latitude, longitude } = pos.coords;
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=pt-BR&zoom=18`
      )
        .then(r => r.json())
        .then(d => {
          // Prioriza a cidade/localidade específica; municipality e county são
          // usados apenas quando a resposta não trouxer uma cidade definida.
          const city =
            d.address?.city ||
            d.address?.town ||
            d.address?.village ||
            d.address?.municipality ||
            d.address?.county;
          if (!cancelled && city) setCidade(city);
        })
        // Depois que o navegador forneceu coordenadas, nunca substitui o
        // resultado pela cidade do IP da operadora.
        .catch(() => {});
    }

    function finishGps(useIpFallback = false) {
      if (locationFinished) return;
      locationFinished = true;
      stopGpsWatch();
      // Não exibe uma cidade calculada a partir de uma coordenada imprecisa.
      // Em computadores, uma leitura baseada na operadora pode errar dezenas
      // de quilômetros mesmo depois de o usuário permitir a localização.
      if (bestPosition && bestPosition.coords.accuracy <= 500) reverseGeocode(bestPosition);
      else if (useIpFallback) fetchByIp();
    }

    // watchPosition permite aguardar uma leitura mais precisa do GPS. A primeira
    // coordenada de computadores/celulares pode ter vários quilômetros de erro.
    function fetchByGps() {
      watchId = navigator.geolocation.watchPosition(
        pos => {
          if (!bestPosition || pos.coords.accuracy < bestPosition.coords.accuracy) bestPosition = pos;
          // Uma margem de até 500 metros é suficiente para identificar o município
          // rapidamente em celulares com a localização precisa ativada.
          if (pos.coords.accuracy <= 500) finishGps();
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) finishGps(true);
          else finishGps(false);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );

      // Se o aparelho não conseguir uma leitura útil, mantém a barra sem cidade.
      gpsTimer = setTimeout(() => finishGps(false), 30000);

    }

    if ("geolocation" in navigator) {
      fetchByGps();
    } else {
      fetchByIp();
    }

    return () => {
      cancelled = true;
      stopGpsWatch();
    };
  }, []);

  if (location === "/sucesso" || location === "/rastrear-pedido") return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] w-full flex items-center justify-center gap-2 py-2.5 px-4 text-white text-xs font-black text-center"
      style={{ background: "linear-gradient(90deg, #b91c1c 0%, #dc2626 50%, #b91c1c 100%)" }}
    >
      <span>🚚</span>
      <span>
        FRETE GRÁTIS até <strong>{deadline}</strong>
        {cidade && <> para <strong>{cidade}</strong></>}
      </span>
      <span className="ml-1 text-red-200 text-[10px] font-semibold hidden sm:inline">— Garanta o seu agora!</span>
    </div>
  );
}

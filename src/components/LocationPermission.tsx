import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

type LocationState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

interface LocationPermissionProps {
  onLocationGranted: (coords: { latitude: number; longitude: number }) => void;
}

/**
 * LocationPermission — professional UX for location permission flow.
 *
 * States:
 *  idle        → shows prompt button
 *  requesting  → branded loading overlay (shown BEFORE browser popup appears)
 *  granted     → triggers onLocationGranted callback
 *  denied      → elegant error card with retry option
 *  unavailable → browser doesn't support geolocation
 */
const LocationPermission: React.FC<LocationPermissionProps> = ({ onLocationGranted }) => {
  const [state, setState] = useState<LocationState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState('unavailable');
      return;
    }

    // Transition to requesting state FIRST — show branded buffer
    // then trigger the browser permission popup after a short delay
    // so the user sees a professional loading state, not a blank screen.
    setState('requesting');

    const timeout = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState('granted');
          onLocationGranted({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let message = 'Location access was denied.';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Location access denied. Please enable location in your browser settings and try again.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Location information is currently unavailable. Please try again.';
          } else if (error.code === error.TIMEOUT) {
            message = 'Location request timed out. Please try again.';
          }
          setErrorMessage(message);
          setState('denied');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }, 350); // brief delay to let the loading animation render smoothly

    return () => clearTimeout(timeout);
  };

  // Clean-up if unmounted during requesting state
  useEffect(() => {
    return () => {
      // no-op cleanup; geolocation API does not provide cancellation
    };
  }, []);

  /* ── Loading Buffer Overlay ──────────────────────────────── */
  if (state === 'requesting') {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[340px] w-full animate-fadeIn"
        role="status"
        aria-live="polite"
        aria-label="Preparing location services"
      >
        {/* Branded Card */}
        <div className="flex flex-col items-center gap-6 bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-sm w-full mx-4">
          {/* Logo Mark */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black">
              <span className="text-honeybee-secondary">Bee</span>
              <span className="text-honeybee-primary">Bridge</span>
            </span>
          </div>

          {/* Animated Spinner */}
          <div className="relative flex items-center justify-center">
            {/* Outer ring */}
            <div className="w-20 h-20 rounded-full border-4 border-honeybee-primary/20 border-t-honeybee-primary animate-spin" />
            {/* Inner pulse */}
            <div className="absolute w-10 h-10 rounded-full bg-honeybee-primary/20 animate-ping" />
            <MapPin className="absolute w-6 h-6 text-honeybee-primary" />
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-white font-bold text-lg mb-1">Preparing Location Services</p>
            <p className="text-white/60 text-sm">
              Your browser will ask for permission shortly…
            </p>
          </div>

          {/* Skeleton UI suggestion */}
          <div className="w-full space-y-2 opacity-40">
            <div className="h-3 bg-white/30 rounded-full w-3/4 mx-auto animate-pulse" />
            <div className="h-3 bg-white/20 rounded-full w-1/2 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Permission Denied / Error ───────────────────────────── */
  if (state === 'denied' || state === 'unavailable') {
    return (
      <div className="flex items-center justify-center min-h-[280px] animate-fadeIn">
        <div className="text-center max-w-sm mx-4">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-300" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {state === 'unavailable' ? 'Not Supported' : 'Location Access Denied'}
          </h3>

          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            {state === 'unavailable'
              ? 'Your browser does not support geolocation. Please use a modern browser to continue.'
              : errorMessage}
          </p>

          {state === 'denied' && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={requestLocation}
                variant="primary"
                className="flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <p className="text-white/40 text-xs">
                Or enable location access in your browser settings and refresh the page.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Idle — Initial Prompt ───────────────────────────────── */
  return (
    <div className="flex items-center justify-center h-full min-h-[280px]">
      <div className="text-center max-w-sm mx-4 animate-fadeIn">
        {/* Icon */}
        <div className="w-20 h-20 bg-honeybee-primary/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <MapPin className="w-10 h-10 text-honeybee-primary" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Find Farms Near You</h2>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">
          Allow location access to discover honey farms, beekeepers, and sellers in your area.
        </p>

        <div className="group">
          <Button onClick={requestLocation} variant="primary" className="w-full">
            Allow Location Access
          </Button>
        </div>

        <p className="text-white/40 text-xs mt-4">
          Your location is only used to find nearby sellers.
        </p>
      </div>
    </div>
  );
};

export default LocationPermission;

"use client"
import Image from "next/image";
import dynamic from "next/dynamic";

import React from "react";

type AmarambaLoaderProps = {
  fullscreen?: boolean;
  label?: string;
  variant?: "default" | "minimal" | "glow" | "pulse";
};

const Lottie = dynamic(() => import("react-lottie").then((m) => m.default), {
  ssr: false,
  loading: () => null,
}) as any;

export default function AmarambaLoader({
  fullscreen = true,
  label = "Loading…",
  variant = "default",
}: AmarambaLoaderProps) {
  const [animationData, setAnimationData] = React.useState<any>(null);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/loader/loader.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => {
        // ignore fetch errors; fallback spinner will display
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const containerClasses = fullscreen
    ? "flex min-h-screen w-full items-center justify-center  bg-background"
    : "flex min-h-[60vh] w-full items-center justify-center rounded-xl bg-background";

  if (variant === "minimal") {
    return (
      <div className={containerClasses} role="status" aria-live="polite" aria-busy="true">
        <div className="flex flex-col items-center gap-6 bg-background"  >
          <div className="relative">
            <Image
              src="/images/logo/eastland.png"
              width={120}
              height={120}
              priority
              alt="Amaramba"
              className="select-none opacity-90"
            />
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/20" />
          </div>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <span className="sr-only">{label}</span>
        </div>
      </div>
    );
  }

  if (variant === "glow") {
    return (
      <div className={containerClasses} role="status" aria-live="polite" aria-busy="true">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-75 blur-lg" />
            <div className="relative rounded-full bg-white/10 p-6 backdrop-blur-sm border border-white/20">
              <Image
                src="/images/logo/eastland.png"
                width={140}
                height={140}
                priority
                alt="Amaramba"
                className="select-none drop-shadow-2xl"
              />
            </div>
          </div>
          <div className="relative">
            <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                   style={{ 
                     animation: "loading-bar 2s ease-in-out infinite" 
                   }} />
            </div>
          </div>
          <p className="text-sm font-medium text-white animate-pulse">
            {label}
          </p>
        </div>
        <style jsx>{`
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={containerClasses} role="status" aria-live="polite" aria-busy="true">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 scale-110" />
            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-400/30 scale-105" style={{ animationDelay: "0.5s" }} />
            <div className="relative rounded-full bg-white shadow-2xl p-4 border-4 border-blue-100">
              <Image
                src="/images/logo/eastland.png"
                width={130}
                height={130}
                priority
                alt="Amaramba"
                className="select-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            <div className="h-1 w-16 animate-pulse rounded-full bg-blue-300" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          </div>
          <span className="sr-only">{label}</span>
        </div>
      </div>
    );
  }

  // Default premium variant
  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        {animationData ? (
          <div className="relative">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData,
                rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
              }}
              height={220}
              width={220}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/images/logo/eastland.png"
              width={120}
              height={120}
              priority
              alt="Amaramba"
              className="select-none opacity-90 animate-pulse"
            />
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
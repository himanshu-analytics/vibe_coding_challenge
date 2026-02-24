"use client";
import { useEffect, useRef } from "react";

export default function DemoPage() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.submit();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
      <form ref={formRef} action="/api/auth/demo-login" method="POST">
        <p className="text-[#7c849a] text-sm animate-pulse">🎬 Loading demo...</p>
      </form>
    </div>
  );
}

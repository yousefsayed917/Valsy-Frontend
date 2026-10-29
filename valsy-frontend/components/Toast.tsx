"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

let toastHandlers: ((msg: ToastMessage) => void)[] = [];

export function showToast(type: ToastType, message: string) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  toastHandlers.forEach((h) => h({ id, type, message }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts((prev) => [...prev.slice(-3), msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 4200);
    };
    toastHandlers.push(handler);
    return () => {
      toastHandlers = toastHandlers.filter((h) => h !== handler);
    };
  }, []);

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-[calc(100vw-2rem)]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl text-sm font-medium min-w-72 max-w-md transition-all duration-300 ${
            toast.type === "success"
              ? "bg-[#19221c]/95 border-[#6e9e7b]/40 text-[#e4f0e7]"
              : "bg-[#261717]/95 border-[#d46a6a]/45 text-[#f7dfdf]"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle
              className="w-5 h-5 text-[#8ab896] flex-shrink-0"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              className="w-5 h-5 text-[#e08585] flex-shrink-0"
              aria-hidden="true"
            />
          )}
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="w-8 h-8 rounded-lg flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

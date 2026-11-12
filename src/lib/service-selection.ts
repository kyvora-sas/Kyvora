"use client";

export type ContactServiceOption =
  | ""
  | "Landing Page / Web"
  | "Aplicación Web/Móvil"
  | "Sistema a Medida"
  | "Automatización / IA"
  | "Otro";

export const VALID_SERVICE_OPTIONS: ReadonlyArray<Exclude<ContactServiceOption, "">> = [
  "Landing Page / Web",
  "Aplicación Web/Móvil",
  "Sistema a Medida",
  "Automatización / IA",
  "Otro",
];

const SERVICE_EVENT = "kyvora:select-service";

export function isValidContactService(value: string | null): value is Exclude<ContactServiceOption, ""> {
  return Boolean(value && VALID_SERVICE_OPTIONS.includes(value as Exclude<ContactServiceOption, "">));
}

export function mapServiceOrTierToContactOption(id: string): ContactServiceOption {
  switch (id) {
    case "web-development":
    case "landing-page":
      return "Landing Page / Web";
    case "app-development":
    case "mvp-web-app":
      return "Aplicación Web/Móvil";
    case "custom-systems":
    case "custom-system":
      return "Sistema a Medida";
    case "automation-ai":
      return "Automatización / IA";
    default:
      return "Otro";
  }
}

let inMemorySelectedService: ContactServiceOption = "";

export function setSelectedContactService(value: ContactServiceOption) {
  inMemorySelectedService = value;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SERVICE_EVENT, { detail: value }));
  }
}

export function triggerContactServiceSelection(id: string) {
  const mapped = mapServiceOrTierToContactOption(id);
  setSelectedContactService(mapped);
  if (typeof document !== "undefined") {
    const el = document.getElementById("contacto");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}

export function subscribeContactService(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const onEvent = () => listener();
  window.addEventListener(SERVICE_EVENT, onEvent);
  window.addEventListener("popstate", onEvent);
  return () => {
    window.removeEventListener(SERVICE_EVENT, onEvent);
    window.removeEventListener("popstate", onEvent);
  };
}

export function getSelectedContactServiceSnapshot(): ContactServiceOption {
  if (inMemorySelectedService) {
    return inMemorySelectedService;
  }
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("service");
      if (isValidContactService(fromUrl)) {
        return fromUrl;
      }
    } catch {
      // Ignorar en entornos restringidos
    }
  }
  return "";
}

export function getSelectedContactServiceServerSnapshot(): ContactServiceOption {
  return "";
}


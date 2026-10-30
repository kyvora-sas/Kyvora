import type { StaticImageData } from "next/image";
import pulsoImg from "@/img/Pulso.png";
import quakeNetImg from "@/img/QuakeNet.png";
import kyvoraStudioImg from "@/img/KyvoraStudio.png";
import pulsAiImg from "@/img/PulsAI.png";
import voiceTranslateImg from "@/img/VoiceTranslate.png";

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  purpose: string;
  technologies: string[];
  status: "Experimental" | "Fase Beta" | "En Desarrollo" | "Producción";
  statusVariant: "warning" | "info" | "success" | "purple";
  image?: StaticImageData | string;
  imageAlt?: string;
  links?: {
    demo?: string;
    repo?: string;
  };
  donationTargetEligible: boolean;
  donationTargetDescription?: string;
}

export const projectsConfig: ProjectItem[] = [
  {
    id: "pulso",
    name: "Pulso",
    tagline: "Red social experimental orientada a interacción en tiempo real.",
    purpose:
      "Explorar nuevas dinámicas de interacción comunitaria y comunicación instantánea móvil y web con latencia reducida y consumo controlado de datos.",
    technologies: ["Next.js", "Flutter", "PostgreSQL", "WebSockets"],
    status: "Fase Beta",
    statusVariant: "info",
    image: pulsoImg,
    imageAlt: "Captura de la interfaz de la aplicación Pulso",
    links: {
      repo: "https://github.com/Kyvora-org",
    },
    donationTargetEligible: true,
    donationTargetDescription: "Fondos dirigidos a pruebas de concurrencia e infraestructura de servidores para la beta.",
  },
  {
    id: "quakenet",
    name: "QuakeNet",
    tagline: "Sistema distribuido de detección y monitoreo sísmico.",
    purpose:
      "Crear una red de monitoreo de eventos telúricos mediante micro-sensores y agregación de señales en tiempo real para análisis geoespacial preliminar.",
    technologies: ["Next.js", "Node.js", "IoT Sensors", "Leaflet", "WebSockets"],
    status: "Experimental",
    statusVariant: "warning",
    image: quakeNetImg,
    imageAlt: "Captura de la interfaz analítica de QuakeNet",
    links: {
      repo: "https://github.com/Kyvora-org",
    },
    donationTargetEligible: true,
    donationTargetDescription: "Fondos dirigidos a componentes de hardware y sensores de prueba para calibración.",
  },
  {
    id: "kyvora-studio",
    name: "Kyvora Studio",
    tagline: "Entorno interno de componentes y arquitectura para despliegue veloz.",
    purpose:
      "Biblioteca de patrones de diseño, utilidades de seguridad y módulos base reutilizables que aceleran el ciclo de vida de los productos desarrollados por KYVORA.",
    technologies: ["TypeScript", "React 19", "Tailwind CSS", "Next.js"],
    status: "En Desarrollo",
    statusVariant: "purple",
    image: kyvoraStudioImg,
    imageAlt: "Captura de la interfaz de Kyvora Studio",
    links: {
      repo: "https://github.com/Kyvora-org",
    },
    donationTargetEligible: false,
  },
  {
    id: "pulsai",
    name: "PulsAI",
    tagline: "Módulo de inteligencia y automatización contextual para flujos de trabajo.",
    purpose:
      "Prototipo de asistentes de IA orientados a procesar tareas repetitivas, clasificación de mensajes y automatización de procesos internos para pequeñas operaciones.",
    technologies: ["Python", "LangChain", "Node.js", "Vector DB"],
    status: "Experimental",
    statusVariant: "warning",
    image: pulsAiImg,
    imageAlt: "Captura de la interfaz analítica de PulsAI",
    links: {
      repo: "https://github.com/Kyvora-org",
    },
    donationTargetEligible: true,
    donationTargetDescription: "Fondos dirigidos al consumo de tokens de experimentación y evaluación de modelos abiertos.",
  },
  {
    id: "voicetranslate",
    name: "VoiceTranslate",
    tagline: "Traductor de voz bidireccional en tiempo real con IA y síntesis auditiva.",
    purpose:
      "Herramienta web de transcripción continua y traducción contextual de baja latencia impulsada por Web Speech API y Gemini 2.5 Flash, con prevención automática de eco y modo conversación en vivo.",
    technologies: ["JavaScript ES6", "Web Speech API", "Gemini Flash", "Text-to-Speech", "PWA"],
    status: "Fase Beta",
    statusVariant: "info",
    image: voiceTranslateImg,
    imageAlt: "Captura de la interfaz de VoiceTranslate",
    links: {
      repo: "https://github.com/Kyvora-org/-VoiceTranslate",
    },
    donationTargetEligible: false,
  },
];

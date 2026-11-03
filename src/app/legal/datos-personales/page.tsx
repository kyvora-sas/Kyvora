import type { Metadata } from "next";
import PersonalDataContent from "@/components/legal/PersonalDataContent";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales — KYVORA",
  description:
    "Política integral de tratamiento de datos personales de KYVORA conforme a la Ley 1581 de 2012, Decreto 1377 de 2013 y Decreto 1074 de 2015 en Colombia.",
};

export default function DatosPersonalesPage() {
  return <PersonalDataContent />;
}

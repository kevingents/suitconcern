import { z } from "zod";

/** Validatie voor het B2B-aanvraagformulier en login. */

export const accountRequestSchema = z.object({
  companyName: z.string().min(2, "Bedrijfsnaam is verplicht."),
  kvk: z.string().min(4, "KvK-nummer is verplicht."),
  vatNumber: z.string().optional().or(z.literal("")),
  businessType: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  contactName: z.string().min(2, "Contactpersoon is verplicht."),
  email: z.string().email("Geldig e-mailadres is verplicht."),
  phone: z.string().min(6, "Telefoonnummer is verplicht."),
  street: z.string().min(2, "Adres is verplicht."),
  postalCode: z.string().min(4, "Postcode is verplicht."),
  city: z.string().min(2, "Plaats is verplicht."),
  country: z.string().default("NL"),
  expectedVolume: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

export type AccountRequestInput = z.infer<typeof accountRequestSchema>;

export const loginSchema = z.object({
  email: z.string().email("Geldig e-mailadres is verplicht."),
  password: z.string().min(1, "Wachtwoord is verplicht."),
});

export type LoginInput = z.infer<typeof loginSchema>;

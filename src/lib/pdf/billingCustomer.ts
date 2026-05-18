import type { BillingCustomer } from "./BillingDocument";

type ContactInput = {
  name: string;
  role: string;
  roleLabel: string | null;
  email: string | null;
  phone: string | null;
} | null;

type CustomerInput = {
  name: string;
  legalName: string | null;
  taxId: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
};

const ROLE_LABELS: Record<string, string> = {
  CEO: "CEO",
  FINANCE: "Finance",
  PROCUREMENT: "Procurement",
  BUSINESS_LEAD: "Business lead",
  TECHNICAL: "Technical",
  OTHER: "",
};

export function buildBillingCustomer(
  customer: CustomerInput,
  contact: ContactInput
): BillingCustomer {
  const cityLine = [customer.city, customer.region, customer.postalCode]
    .filter(Boolean)
    .join(", ");
  const addressLines = [
    customer.addressLine1,
    customer.addressLine2,
    cityLine || null,
    customer.country,
  ].filter((line): line is string => Boolean(line));

  return {
    name: customer.name,
    legalName: customer.legalName,
    taxId: customer.taxId,
    addressLines,
    email: customer.email,
    phone: customer.phone,
    contact: contact
      ? {
          name: contact.name,
          role: contact.roleLabel?.trim() || ROLE_LABELS[contact.role] || null,
          email: contact.email,
          phone: contact.phone,
        }
      : null,
  };
}

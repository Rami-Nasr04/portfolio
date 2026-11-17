import services from "@/config/services.json";

export interface ServiceProduct {
  id: string;
  name: string;
  included: string[];
  /** Starting price in USD, or null for "Let's talk". */
  price: number | null;
  delivery: string;
}

export const SERVICES: ServiceProduct[] = services;

export function formatPrice(product: ServiceProduct): string {
  return product.price === null ? "Let's talk" : `From $${product.price.toLocaleString("en-US")}`;
}

/** The subject and message the contact form starts with for a set of chosen packages. */
export function buildRequest(products: ServiceProduct[]): { subject: string; message: string } {
  const lines = products.map((product) => `- ${product.name} (${formatPrice(product)}, ${product.delivery})`);
  return {
    subject: `Project request: ${products.map((product) => product.name).join(", ")}`,
    message: `Hi Rami, I'd like to talk about:\n${lines.join("\n")}\n\nAbout my project: `,
  };
}

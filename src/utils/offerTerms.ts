import { Offer } from "@/types";
import { formatINR } from "@/utils/currency";

/**
 * Builds the full, auto-generated Terms & Conditions list for an offer.
 * Mirrors the "Live Terms & Conditions" card in the restaurant partner app
 * so customers see the exact same points on the consumer side.
 */
export const buildOfferTerms = (offer: Offer): string[] => {
  const terms: string[] = [];

  if (offer.minOrder && offer.minOrder > 0) {
    terms.push(`Minimum order value of ${formatINR(offer.minOrder)} is required.`);
  }

  if (offer.offerType === "percentage") {
    if (offer.maxCap) {
      terms.push(`Maximum discount is capped at ${formatINR(offer.maxCap)}.`);
    }
  } else if (offer.offerType === "bogo") {
    if (offer.applicableScope !== "all" && offer.applicableIds.length > 0) {
      terms.push(`Valid only on selected ${offer.applicableScope === "category" ? "categories" : "items"}.`);
    }
    terms.push("Cheapest item in the cart will be free.");
  } else if (offer.offerType === "free_item") {
    if (offer.applicableScope !== "all" && offer.applicableIds.length > 0) {
      terms.push(`Valid only on selected ${offer.applicableScope === "category" ? "categories" : "items"}.`);
    }
    if (offer.freeItemName) {
      terms.push(`Free item offered is: ${offer.freeItemName}.`);
    }
  } else {
    if (offer.applicableScope !== "all") {
      terms.push(`Valid only on selected ${offer.applicableScope === "category" ? "categories" : "items"}.`);
    }
  }

  if (offer.customerType === "new") terms.push("Valid for new customers only.");
  if (offer.customerType === "returning") terms.push("Valid for returning customers only.");

  const activeOrderTypes = (Object.entries(offer.orderTypes) as [string, boolean][])
    .filter(([, active]) => active)
    .map(([type]) => (type === "dineIn" ? "Dine-In" : type.charAt(0).toUpperCase() + type.slice(1)));
  if (activeOrderTypes.length > 0 && activeOrderTypes.length < 3) {
    terms.push(`Valid on ${activeOrderTypes.join(", ")} order types only.`);
  }

  if (offer.paymentMode === "prepaid") terms.push("Valid on prepaid online orders only.");

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  if (offer.startDate) terms.push(`Offer starts at ${formatDate(offer.startDate)}.`);
  if (offer.endDate) terms.push(`Offer ends at ${formatDate(offer.endDate)}.`);
  if (!offer.startDate && !offer.endDate) terms.push("Offer valid for a limited time period.");

  if (offer.perUserLimit) terms.push(`Offer can be used ${offer.perUserLimit} time(s) per user.`);
  if (offer.totalUsageLimit) terms.push(`Total campaign usage is capped at ${offer.totalUsageLimit} usages.`);

  if (offer.allowClubbing) terms.push("Can be clubbed with other ongoing offers.");
  else terms.push("Cannot be clubbed with any other ongoing offers.");

  return terms;
};

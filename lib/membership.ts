export const MEMBERSHIP_FEE = "$15.00";
export const ZELLE_EMAIL = "utd.aimdb@gmail.com";

export const MEMBERSHIP_RULES = [
  "Membership is available to anyone who is part of The University of Texas at Dallas.",
  "You promise not to use your membership to conduct any fraudulent or business activity.",
];

export type DegreeLevel = "bs" | "ms" | "phd";

export const DEGREE_LEVELS: { value: DegreeLevel; label: string }[] = [
  { value: "bs", label: "BS" },
  { value: "ms", label: "MS" },
  { value: "phd", label: "PhD" },
];

export type MembershipInput = {
  personal_email: string;
  phone: string;
  degree_level: string;
  transaction_id: string;
  accepted_rules: boolean;
  paid_fee: boolean;
  accepted_communication: boolean;
};

export type MembershipValues = {
  personal_email: string | null;
  phone: string | null;
  degree_level: DegreeLevel | null;
  transaction_id: string | null;
  accepted_rules: boolean;
  paid_fee: boolean;
  accepted_communication: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_SEPARATORS = /[\s().-]/g;
const PHONE_PATTERN = /^\+?\d{10,15}$/;
const DEGREE_VALUES = new Set<string>(DEGREE_LEVELS.map((d) => d.value));

/**
 * Formats are checked whenever a field is filled in; `requireAll` additionally
 * demands every field and declaration, as submitting does.
 */
export function readMembership(
  formData: FormData,
  requireAll: boolean,
): { input: MembershipInput; values: MembershipValues | null; error: string | null } {
  const input: MembershipInput = {
    personal_email: String(formData.get("personal_email") ?? "").trim().toLowerCase(),
    phone: String(formData.get("phone") ?? "").trim(),
    degree_level: String(formData.get("degree_level") ?? ""),
    transaction_id: String(formData.get("transaction_id") ?? "").trim(),
    accepted_rules: formData.get("accepted_rules") === "on",
    paid_fee: formData.get("paid_fee") === "on",
    accepted_communication: formData.get("accepted_communication") === "on",
  };
  const fail = (error: string) => ({ input, values: null, error });
  const phone = input.phone.replace(PHONE_SEPARATORS, "");

  if (input.personal_email && !EMAIL_PATTERN.test(input.personal_email)) {
    return fail("Enter a valid personal email address.");
  }
  if (input.phone && !PHONE_PATTERN.test(phone)) {
    return fail("Enter a phone number with 10 to 15 digits.");
  }
  if (input.degree_level && !DEGREE_VALUES.has(input.degree_level)) {
    return fail("Choose your current degree level.");
  }
  if (input.transaction_id.length > 100) {
    return fail("Transaction ID must be 100 characters or fewer.");
  }

  if (requireAll) {
    if (!input.personal_email) return fail("Enter your personal email.");
    if (!input.phone) return fail("Enter your phone number.");
    if (!input.degree_level) return fail("Choose your current degree level.");
    if (!input.transaction_id) {
      return fail("Enter the transaction ID from your Zelle payment.");
    }
    if (!input.accepted_rules || !input.paid_fee || !input.accepted_communication) {
      return fail("Check every declaration before submitting.");
    }
  }

  return {
    input,
    error: null,
    values: {
      personal_email: input.personal_email || null,
      phone: phone || null,
      degree_level: (input.degree_level || null) as DegreeLevel | null,
      transaction_id: input.transaction_id || null,
      accepted_rules: input.accepted_rules,
      paid_fee: input.paid_fee,
      accepted_communication: input.accepted_communication,
    },
  };
}

export function degreeLabel(level: DegreeLevel | null) {
  return DEGREE_LEVELS.find((d) => d.value === level)?.label ?? null;
}

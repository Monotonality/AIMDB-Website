import { cache } from "react";
import type { DegreeLevel } from "@/lib/membership";
import type {
  AcademicYear,
  GraduationSemester,
} from "@/lib/profile-details";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  role: "admin" | "user";
  is_member: boolean;
  first_name: string | null;
  last_name: string | null;
  major: string | null;
  graduation_semester: GraduationSemester | null;
  graduation_year: number | null;
  academic_year: AcademicYear | null;
  deactivated_at: string | null;
};

export type Application = {
  id: number;
  user_id: string;
  status: "draft" | "submitted";
  personal_email: string | null;
  phone: string | null;
  degree_level: DegreeLevel | null;
  transaction_id: string | null;
  accepted_rules: boolean;
  paid_fee: boolean;
  accepted_communication: boolean;
  submitted_at: string | null;
  payment_verified: boolean;
  payment_verified_at: string | null;
};

export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  return {
    id: String(data.claims.sub),
    email: typeof data.claims.email === "string" ? data.claims.email : null,
  };
});

export const getProfile = cache(async () => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, role, is_member, first_name, last_name, major, graduation_semester, graduation_year, academic_year, deactivated_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  return data as Profile | null;
});

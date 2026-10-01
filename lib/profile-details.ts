export type AcademicYear =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "graduate";

export const ACADEMIC_YEARS: { value: AcademicYear; label: string }[] = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate" },
];

export type GraduationSemester = "spring" | "summer" | "fall";

export const SEMESTERS: { value: GraduationSemester; label: string }[] = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
];

export type ProfileDetails = {
  first_name: string;
  last_name: string;
  academic_year: AcademicYear;
  major: string;
  graduation_semester: GraduationSemester;
  graduation_year: number;
};

/** Raw form strings, echoed back so a rejected form keeps what was typed. */
export type ProfileDetailsInput = Record<keyof ProfileDetails, string>;

const ACADEMIC_YEAR_VALUES = new Set<string>(ACADEMIC_YEARS.map((y) => y.value));
const SEMESTER_VALUES = new Set<string>(SEMESTERS.map((s) => s.value));

export function readProfileDetails(formData: FormData): {
  input: ProfileDetailsInput;
  details: ProfileDetails | null;
  error: string | null;
} {
  const input: ProfileDetailsInput = {
    first_name: String(formData.get("first_name") ?? "").trim(),
    last_name: String(formData.get("last_name") ?? "").trim(),
    academic_year: String(formData.get("academic_year") ?? ""),
    major: String(formData.get("major") ?? "").trim(),
    graduation_semester: String(formData.get("graduation_semester") ?? ""),
    graduation_year: String(formData.get("graduation_year") ?? ""),
  };
  const fail = (error: string) => ({ input, details: null, error });

  if (!input.first_name || !input.last_name) {
    return fail("Enter your first and last name.");
  }
  if (input.first_name.length > 80 || input.last_name.length > 80) {
    return fail("Names must be 80 characters or fewer.");
  }
  if (!ACADEMIC_YEAR_VALUES.has(input.academic_year)) {
    return fail("Choose your year.");
  }
  if (!input.major) return fail("Enter your major.");
  if (input.major.length > 120) {
    return fail("Major must be 120 characters or fewer.");
  }
  if (!SEMESTER_VALUES.has(input.graduation_semester)) {
    return fail("Choose your graduation semester.");
  }
  const year = Number(input.graduation_year);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return fail("Choose your graduation year.");
  }

  return {
    input,
    error: null,
    details: {
      first_name: input.first_name,
      last_name: input.last_name,
      academic_year: input.academic_year as AcademicYear,
      major: input.major,
      graduation_semester: input.graduation_semester as GraduationSemester,
      graduation_year: year,
    },
  };
}

/** The year before this one through seven years out, plus `keep` if it falls outside. */
export function graduationYears(keep?: number | null) {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let year = current - 1; year <= current + 7; year++) years.push(year);
  if (keep && !years.includes(keep)) {
    years.push(keep);
    years.sort((a, b) => a - b);
  }
  return years;
}

export function graduationLabel(
  semester: GraduationSemester | null,
  year: number | null,
) {
  if (!semester || !year) return null;
  return `${semester.charAt(0).toUpperCase()}${semester.slice(1)} ${year}`;
}

export function academicYearLabel(year: AcademicYear | null) {
  return ACADEMIC_YEARS.find((y) => y.value === year)?.label ?? null;
}

export function displayName(
  person: { first_name: string | null; last_name: string | null } | null,
) {
  if (!person) return null;
  return [person.first_name, person.last_name].filter(Boolean).join(" ") || null;
}

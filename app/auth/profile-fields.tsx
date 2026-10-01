import {
  ACADEMIC_YEARS,
  SEMESTERS,
  type ProfileDetailsInput,
} from "@/lib/profile-details";

const labelClass =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-700";

const fieldClass =
  "mt-2 w-full border border-ink-800 bg-white px-3 py-3 text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function ProfileFields({
  defaults,
  years,
}: {
  defaults?: Partial<ProfileDetailsInput>;
  years: number[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>first name</span>
          <input
            className={fieldClass}
            type="text"
            name="first_name"
            autoComplete="given-name"
            required
            maxLength={80}
            defaultValue={defaults?.first_name}
          />
        </label>
        <label className="block">
          <span className={labelClass}>last name</span>
          <input
            className={fieldClass}
            type="text"
            name="last_name"
            autoComplete="family-name"
            required
            maxLength={80}
            defaultValue={defaults?.last_name}
          />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>academic year</span>
        <select
          className={fieldClass}
          name="academic_year"
          required
          defaultValue={defaults?.academic_year ?? ""}
        >
          <option value="" disabled>
            Select year
          </option>
          {ACADEMIC_YEARS.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={labelClass}>major</span>
        <input
          className={fieldClass}
          type="text"
          name="major"
          required
          maxLength={120}
          defaultValue={defaults?.major}
        />
      </label>
      <fieldset>
        <legend className={labelClass}>expected graduation</legend>
        <div className="grid grid-cols-2 gap-6">
          <label className="block">
            <span className="sr-only">Semester</span>
            <select
              className={fieldClass}
              name="graduation_semester"
              required
              defaultValue={defaults?.graduation_semester ?? ""}
            >
              <option value="" disabled>
                Semester
              </option>
              {SEMESTERS.map((semester) => (
                <option key={semester.value} value={semester.value}>
                  {semester.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Year</span>
            <select
              className={fieldClass}
              name="graduation_year"
              required
              defaultValue={defaults?.graduation_year ?? ""}
            >
              <option value="" disabled>
                Year
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

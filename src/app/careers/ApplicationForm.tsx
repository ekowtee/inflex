"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { CV_ACCEPT, checkCvMeta } from "@/lib/cv";
import { APPLY_EMAIL } from "./roles";

/**
 * The careers application — owner, 25 September 2026.
 *
 * Posts the fields and the CV as multipart form data to /api/careers/apply
 * instead of the old `mailto:` apply links, which opened a mail client on
 * the visitor's machine. The API emails the CV to info@inflexions.tech and
 * records the application as a Lead in the admin.
 *
 * Same visual language, honeypot and Turnstile as the training enquiry
 * form. The CV is checked for type and size here before it uploads; the API
 * checks it again, bytes included.
 */

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const SUCCESS = "Received. Thank you — we'll be in touch if your background fits the role.";
const NOTHING_SENT = `Nothing was sent. Try again, or email your CV to ${APPLY_EMAIL}.`;

const field =
  "w-full rounded-[6px] border border-neutral-300 bg-white px-4 py-3 type-body text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] placeholder:text-neutral-400 hover:border-neutral-500";
const labelClass = "type-telemetry block text-neutral-500";
const fileField =
  "w-full rounded-[6px] border border-neutral-300 bg-white px-4 py-3 type-body text-neutral-900 transition-colors duration-[var(--motion-duration-micro)] hover:border-neutral-500 file:mr-4 file:cursor-pointer file:rounded-[6px] file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:font-semibold file:text-white";

export type ApplicationRoleOption = { id: string; label: string };

export interface ApplicationFormProps {
  roles: ReadonlyArray<ApplicationRoleOption>;
  /** The role selected when the form first renders. */
  defaultRole?: string;
  /** Send `defaultRole` as a hidden field instead of showing the role menu. */
  lockRole?: boolean;
  /**
   * Preset the role menu from `?role=` in the URL (the "Apply for this
   * role" links on /jobs), falling back to `defaultRole`.
   */
  roleFromQuery?: boolean;
  /** Label for the free-text note. */
  noteLabel?: string;
}

const validRole = (roles: ReadonlyArray<ApplicationRoleOption>, id: string | null | undefined) =>
  id && roles.some((r) => r.id === id) ? id : "";

export default function ApplicationForm({
  roles,
  defaultRole,
  lockRole = false,
  roleFromQuery = false,
  noteLabel = "Anything we should know? (optional)",
}: ApplicationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const preset = validRole(roles, defaultRole);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const resetTurnstile = () => {
    const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile;
    turnstile?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const data = new FormData(e.currentTarget);
    const turnstileToken = String(data.get("cf-turnstile-response") ?? "");
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setMessage({
        type: "error",
        text: "The verification check above has not completed. Wait a moment for it to finish, then send again.",
      });
      return;
    }

    const cv = data.get("cv");
    if (!(cv instanceof File) || cv.size === 0) {
      setMessage({ type: "error", text: `Attach your CV as a PDF or Word file. ${NOTHING_SENT}` });
      return;
    }
    const cvCheck = checkCvMeta(cv.name, cv.size);
    if (!cvCheck.ok) {
      setMessage({ type: "error", text: `${cvCheck.error} ${NOTHING_SENT}` });
      return;
    }

    data.delete("cf-turnstile-response");
    if (turnstileToken) data.set("turnstileToken", turnstileToken);

    setSending(true);
    try {
      // No Content-Type header: the browser sets multipart/form-data with its boundary.
      const res = await fetch("/api/careers/apply", { method: "POST", body: data });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        resetTurnstile();
        throw new Error(err?.error ?? `Failed (${res.status}).`);
      }
      setMessage({ type: "success", text: SUCCESS });
      formRef.current?.reset();
      resetTurnstile();
    } catch (err) {
      const detail = err instanceof Error ? err.message : "The application did not reach us.";
      // The API's messages already carry the fallback line; add it otherwise.
      setMessage({
        type: "error",
        text: detail.includes("Nothing was sent") ? detail : `${detail} ${NOTHING_SENT}`,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <input
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="apply-name" className={labelClass}>
              Your name
            </label>
            <input id="apply-name" name="name" type="text" required maxLength={200} autoComplete="name" className={`${field} mt-3`} />
          </div>
          <div>
            <label htmlFor="apply-email" className={labelClass}>
              Email
            </label>
            <input id="apply-email" name="email" type="email" required maxLength={200} autoComplete="email" className={`${field} mt-3`} />
          </div>
          <div>
            <label htmlFor="apply-phone" className={labelClass}>
              Phone (optional)
            </label>
            <input id="apply-phone" name="phone" type="tel" maxLength={50} autoComplete="tel" className={`${field} mt-3`} />
          </div>
          {lockRole ? (
            <input type="hidden" name="role" value={preset} />
          ) : (
            <div>
              <label htmlFor="apply-role" className={labelClass}>
                Role
              </label>
              {roleFromQuery ? (
                // Only the menu waits on the URL, so the page stays static
                // and the rest of the form (and Turnstile) never remounts.
                <Suspense fallback={<RoleSelect roles={roles} preset={preset} />}>
                  <RoleSelectFromQuery roles={roles} fallback={preset} />
                </Suspense>
              ) : (
                <RoleSelect roles={roles} preset={preset} />
              )}
            </div>
          )}
          <div className={lockRole ? undefined : "md:col-span-2"}>
            <label htmlFor="apply-link" className={labelClass}>
              LinkedIn or portfolio (optional)
            </label>
            <input
              id="apply-link"
              name="link"
              type="text"
              inputMode="url"
              maxLength={500}
              autoComplete="url"
              placeholder="https://"
              className={`${field} mt-3`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="apply-cv" className={labelClass}>
            CV
          </label>
          <input
            id="apply-cv"
            name="cv"
            type="file"
            required
            accept={CV_ACCEPT}
            aria-describedby="apply-cv-help"
            className={`${fileField} mt-3`}
          />
          <p id="apply-cv-help" className="type-body mt-2 text-neutral-500">
            PDF or Word, up to 5 MB
          </p>
        </div>

        <div>
          <label htmlFor="apply-note" className={labelClass}>
            {noteLabel}
          </label>
          <textarea id="apply-note" name="note" rows={5} maxLength={4000} className={`${field} mt-3 resize-y`} />
        </div>

        {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />}

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`type-body max-w-[60ch] ${message.type === "success" ? "text-neutral-900" : "text-primary-600"}`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send application"}
        </button>
      </form>
    </>
  );
}

/**
 * The role menu. Uncontrolled, and keyed on the preset: a new preset
 * (another role's "Apply" link on the same page) remounts only the menu,
 * and form.reset() returns it to the preset.
 */
function RoleSelect({ roles, preset }: { roles: ReadonlyArray<ApplicationRoleOption>; preset: string }) {
  return (
    <select key={preset} id="apply-role" name="role" required defaultValue={preset} className={`${field} mt-3`}>
      <option value="" disabled>
        Choose a role
      </option>
      {roles.map((r) => (
        <option key={r.id} value={r.id}>
          {r.label}
        </option>
      ))}
    </select>
  );
}

function RoleSelectFromQuery({ roles, fallback }: { roles: ReadonlyArray<ApplicationRoleOption>; fallback: string }) {
  const fromQuery = validRole(roles, useSearchParams().get("role"));
  return <RoleSelect roles={roles} preset={fromQuery || fallback} />;
}

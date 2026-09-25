/**
 * CV upload rules for the careers application form, shared by the browser
 * (a quick check before sending) and /api/careers/apply (the real check).
 *
 * PDF, DOC or DOCX, up to 5 MB. The server checks the extension AND the
 * file's first bytes, so a renamed executable or image is refused. Pure and
 * dependency-free (Uint8Array, not Buffer) so it runs in either place.
 */

export const CV_MAX_BYTES = 5 * 1024 * 1024;

export const CV_TYPES = {
  pdf: { contentType: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // %PDF-
  doc: { contentType: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE2 compound file
  docx: {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    magic: [0x50, 0x4b, 0x03, 0x04], // PK\x03\x04, a zip
  },
} as const;

export type CvExtension = keyof typeof CV_TYPES;

/** For the file input's `accept` attribute. */
export const CV_ACCEPT = [
  ".pdf",
  ".doc",
  ".docx",
  ...Object.values(CV_TYPES).map((t) => t.contentType),
].join(",");

export const CV_TYPE_ERROR = "Your CV must be a PDF or Word file (.pdf, .doc or .docx).";
export const CV_SIZE_ERROR = "Your CV is larger than 5 MB. Save a smaller copy and try again.";
export const CV_EMPTY_ERROR = "Your CV file is empty. Choose the file again.";
export const CV_CONTENT_ERROR =
  "Your CV does not look like the file type its name says. Save it again as a PDF or Word file and try again.";

export type CvCheck =
  | { ok: true; ext: CvExtension; contentType: string }
  | { ok: false; error: string };

export function cvExtension(filename: string): CvExtension | null {
  const m = /\.([a-z0-9]+)$/i.exec(filename.trim());
  const ext = m?.[1]?.toLowerCase();
  return ext && Object.prototype.hasOwnProperty.call(CV_TYPES, ext) ? (ext as CvExtension) : null;
}

/** Name and size only: what the browser can check before it uploads. */
export function checkCvMeta(filename: string, size: number): CvCheck {
  const ext = cvExtension(filename);
  if (!ext) return { ok: false, error: CV_TYPE_ERROR };
  if (size <= 0) return { ok: false, error: CV_EMPTY_ERROR };
  if (size > CV_MAX_BYTES) return { ok: false, error: CV_SIZE_ERROR };
  return { ok: true, ext, contentType: CV_TYPES[ext].contentType };
}

/** The full check: name, size, and that the bytes start as the type claims. */
export function checkCv(filename: string, bytes: Uint8Array): CvCheck {
  const meta = checkCvMeta(filename, bytes.byteLength);
  if (!meta.ok) return meta;
  const { magic } = CV_TYPES[meta.ext];
  if (bytes.byteLength < magic.length || magic.some((b, i) => bytes[i] !== b)) {
    return { ok: false, error: CV_CONTENT_ERROR };
  }
  return meta;
}

/**
 * A filename safe to put on an email attachment and in the lead notes: no
 * path, no control or header-breaking characters, sensible length, the
 * checked extension kept.
 */
export function safeCvFilename(filename: string, ext: CvExtension): string {
  const base = (filename.split(/[\\/]/).pop() ?? "")
    .replace(/\.[^.]*$/, "")
    .replace(/[\u0000-\u001f\u007f"<>:|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
  return `${base || "cv"}.${ext}`;
}

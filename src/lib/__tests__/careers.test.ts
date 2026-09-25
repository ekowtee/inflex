/**
 * Careers application: the CV check (src/lib/cv.ts) and the text-field
 * schema (applicationSchema in src/lib/validators.ts) behind
 * /api/careers/apply.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CV_CONTENT_ERROR,
  CV_EMPTY_ERROR,
  CV_MAX_BYTES,
  CV_SIZE_ERROR,
  CV_TYPE_ERROR,
  checkCv,
  checkCvMeta,
  cvExtension,
  safeCvFilename,
} from "../cv";
import { applicationSchema } from "../validators";
import { createRateLimiter } from "../rateLimit";

const PDF = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]; // %PDF-1.7
const DOC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const DOCX = [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const EXE = [0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]; // MZ

/** A file of `size` bytes that starts with `head`. */
function file(head: number[], size = 1024): Uint8Array {
  const b = new Uint8Array(size);
  b.set(head.slice(0, size));
  return b;
}

describe("cvExtension", () => {
  it("accepts pdf, doc and docx in any case", () => {
    assert.equal(cvExtension("cv.pdf"), "pdf");
    assert.equal(cvExtension("My CV.DOCX"), "docx");
    assert.equal(cvExtension("résumé.Doc"), "doc");
  });

  it("rejects other and missing extensions", () => {
    assert.equal(cvExtension("cv.txt"), null);
    assert.equal(cvExtension("cv.pdf.exe"), null);
    assert.equal(cvExtension("cv"), null);
    assert.equal(cvExtension("cv.pdf "), "pdf");
  });

  it("does not treat Object.prototype keys as extensions", () => {
    assert.equal(cvExtension("x.constructor"), null);
    assert.equal(cvExtension("x.toString"), null);
    assert.equal(cvExtension("x.__proto__"), null);
  });
});

describe("checkCvMeta (browser-side check)", () => {
  it("passes a right-sized PDF", () => {
    const r = checkCvMeta("cv.pdf", 200_000);
    assert.deepEqual(r, { ok: true, ext: "pdf", contentType: "application/pdf" });
  });

  it("accepts exactly 5 MB and rejects one byte more", () => {
    assert.equal(checkCvMeta("cv.pdf", CV_MAX_BYTES).ok, true);
    assert.deepEqual(checkCvMeta("cv.pdf", CV_MAX_BYTES + 1), { ok: false, error: CV_SIZE_ERROR });
  });

  it("rejects empty files and wrong types", () => {
    assert.deepEqual(checkCvMeta("cv.pdf", 0), { ok: false, error: CV_EMPTY_ERROR });
    assert.deepEqual(checkCvMeta("cv.png", 1000), { ok: false, error: CV_TYPE_ERROR });
  });
});

describe("checkCv (server-side check, bytes included)", () => {
  it("accepts each type when the bytes match the extension", () => {
    assert.equal(checkCv("cv.pdf", file(PDF)).ok, true);
    assert.equal(checkCv("cv.doc", file(DOC)).ok, true);
    const docx = checkCv("cv.docx", file(DOCX));
    assert.ok(docx.ok);
    assert.equal(docx.contentType, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  });

  it("rejects a file whose bytes do not match its extension", () => {
    assert.deepEqual(checkCv("cv.pdf", file(PNG)), { ok: false, error: CV_CONTENT_ERROR });
    assert.deepEqual(checkCv("cv.docx", file(EXE)), { ok: false, error: CV_CONTENT_ERROR });
    assert.deepEqual(checkCv("cv.doc", file(PDF)), { ok: false, error: CV_CONTENT_ERROR });
    assert.deepEqual(checkCv("cv.pdf", file(DOCX)), { ok: false, error: CV_CONTENT_ERROR });
  });

  it("rejects a real PDF with the wrong extension", () => {
    assert.deepEqual(checkCv("cv.txt", file(PDF)), { ok: false, error: CV_TYPE_ERROR });
  });

  it("rejects a file shorter than its magic number", () => {
    assert.deepEqual(checkCv("cv.pdf", new Uint8Array([0x25, 0x50, 0x44])), {
      ok: false,
      error: CV_CONTENT_ERROR,
    });
  });

  it("rejects empty and oversized files before looking at the bytes", () => {
    assert.deepEqual(checkCv("cv.pdf", new Uint8Array(0)), { ok: false, error: CV_EMPTY_ERROR });
    assert.deepEqual(checkCv("cv.pdf", file(PDF, CV_MAX_BYTES + 1)), { ok: false, error: CV_SIZE_ERROR });
  });

  it("works on a Node Buffer as well as a Uint8Array", () => {
    assert.equal(checkCv("cv.pdf", Buffer.from(file(PDF))).ok, true);
  });
});

describe("safeCvFilename", () => {
  it("keeps a normal name", () => {
    assert.equal(safeCvFilename("Ama Mensah CV.pdf", "pdf"), "Ama Mensah CV.pdf");
  });

  it("strips paths, control and header-breaking characters", () => {
    assert.equal(safeCvFilename("C:\\Users\\ama\\cv.pdf", "pdf"), "cv.pdf");
    assert.equal(safeCvFilename('../../"evil"\r\n<x>.docx', "docx"), "evilx.docx");
  });

  it("uses the checked extension and falls back to cv", () => {
    assert.equal(safeCvFilename("CV.PDF", "pdf"), "CV.pdf");
    assert.equal(safeCvFilename("???.doc", "doc"), "cv.doc");
    assert.ok(safeCvFilename(`${"a".repeat(300)}.pdf`, "pdf").length <= 104);
  });
});

describe("applicationSchema", () => {
  const base = { name: "Ama Mensah", email: "ama@example.com", role: "network-engineer" };

  it("accepts the minimum: name, email and a known role", () => {
    const r = applicationSchema.safeParse(base);
    assert.ok(r.success);
    assert.equal(r.data.phone, undefined);
    assert.equal(r.data.link, undefined);
  });

  it("accepts every role id plus internship and open-application", () => {
    for (const role of [
      "network-engineer",
      "cloud-solutions-architect",
      "cybersecurity-analyst",
      "internship",
      "open-application",
    ]) {
      assert.ok(applicationSchema.safeParse({ ...base, role }).success, role);
    }
  });

  it("rejects an unknown or missing role", () => {
    assert.equal(applicationSchema.safeParse({ ...base, role: "ceo" }).success, false);
    assert.equal(applicationSchema.safeParse({ ...base, role: undefined }).success, false);
  });

  it("requires a name and a valid email", () => {
    assert.equal(applicationSchema.safeParse({ ...base, name: "   " }).success, false);
    assert.equal(applicationSchema.safeParse({ ...base, email: "not-an-email" }).success, false);
    const missing = applicationSchema.safeParse({ ...base, email: undefined });
    assert.equal(missing.success, false);
    assert.equal(missing.error?.issues[0]?.message, "Enter a valid email address.");
  });

  it("trims text and treats blank optional fields as absent", () => {
    const r = applicationSchema.safeParse({
      ...base,
      name: "  Ama Mensah ",
      email: " ama@example.com ",
      phone: "  ",
      note: "",
      link: "",
    });
    assert.ok(r.success);
    assert.equal(r.data.name, "Ama Mensah");
    assert.equal(r.data.email, "ama@example.com");
    assert.equal(r.data.phone, undefined);
    assert.equal(r.data.note, undefined);
    assert.equal(r.data.link, undefined);
  });

  it("caps the note at 4000 characters", () => {
    assert.ok(applicationSchema.safeParse({ ...base, note: "a".repeat(4000) }).success);
    assert.equal(applicationSchema.safeParse({ ...base, note: "a".repeat(4001) }).success, false);
  });

  it("accepts http(s) links and adds https:// to a bare domain", () => {
    const full = applicationSchema.safeParse({ ...base, link: "https://www.linkedin.com/in/ama" });
    assert.ok(full.success);
    assert.equal(full.data.link, "https://www.linkedin.com/in/ama");
    const bare = applicationSchema.safeParse({ ...base, link: "github.com/ama" });
    assert.ok(bare.success);
    assert.equal(bare.data.link, "https://github.com/ama");
  });

  it("rejects non-web and malformed links", () => {
    for (const link of ["javascript:alert(1)", "ftp://example.com/cv", "not a link", "https://localhost"]) {
      assert.equal(applicationSchema.safeParse({ ...base, link }).success, false, link);
    }
  });

  it("rejects a filled honeypot", () => {
    assert.equal(applicationSchema.safeParse({ ...base, hp: "bot" }).success, false);
  });
});

describe("createRateLimiter", () => {
  it("allows `limit` hits per window, then reports the wait, then resets", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    assert.deepEqual(check("ip", 0), { ok: true });
    assert.deepEqual(check("ip", 100), { ok: true });
    assert.deepEqual(check("ip", 200), { ok: false, retryAfter: 1 });
    assert.deepEqual(check("other", 200), { ok: true });
    assert.deepEqual(check("ip", 1001), { ok: true });
  });
});

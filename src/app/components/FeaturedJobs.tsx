import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { roles } from "../careers/roles";

/**
 * The open roles — PHASE5_BRIEF.md §4 Task 6.
 *
 * Three shadowed white cards become three entries. The photographs stay,
 * graded; the shadow, the radius and the underlined text link do not.
 * Each entry opens its role on /jobs; the roles live in careers/roles.ts.
 */

export default function FeaturedJobs() {
  return (
    <section className="band-ivory w-full py-24 md:py-32" aria-label="Featured jobs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="type-h2 text-neutral-900">Featured Jobs</h2>

        <div className="mt-16 grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((job) => (
            <article key={job.id} className="group relative flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={job.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="photo-grade object-cover"
                />
              </div>
              <h3 className="type-h3 mt-8 flex items-start justify-between gap-4 border-t border-neutral-200 pt-8 text-neutral-900">
                <Link
                  href={`/jobs#${job.id}`}
                  className="underline decoration-transparent decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--motion-duration-ui)] after:absolute after:inset-0 after:content-[''] group-hover:decoration-neutral-900"
                >
                  {job.title}
                </Link>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-1 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </h3>
              <p className="type-body mt-4 text-neutral-600">{job.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

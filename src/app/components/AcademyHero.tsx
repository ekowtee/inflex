import Link from "next/link";

interface AcademyHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  eyebrow?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function AcademyHero({
  title,
  subtitle,
  backgroundImage,
  eyebrow,
  breadcrumbs,
}: AcademyHeroProps) {
  return (
    <div className="relative w-full h-[500px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backgroundImage}
        alt=""
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-end pb-10 md:pb-28 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="md:w-2/3 lg:w-2/3 text-white space-y-4">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-sm text-white/80"
              >
                {breadcrumbs.map((crumb, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-white transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                    {idx < breadcrumbs.length - 1 && (
                      <span className="text-white/50">/</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            {eyebrow && (
              <span className="inline-block bg-[#BD2E25] text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-sm">
                {eyebrow}
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold">{title}</h1>
            <p className="text-lg text-white/90 max-w-2xl">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

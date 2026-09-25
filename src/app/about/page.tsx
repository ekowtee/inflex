import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/motion/Magnetic";
import Reveal from "@/motion/Reveal";
import AskBand from "../components/AskBand";
import ClientRoster from "../components/ClientRoster";
import Leaders from "../components/Leaders";
import PageHero from "../components/PageHero";

/**
 * /about — PHASE5_BRIEF.md §4 Task 6.
 *
 * Opens on formation 5, the mark, which is the one formation that stands
 * for the company rather than for something it builds.
 *
 * Copy is unchanged except for one deletion, recorded in PHASE5_REPORT.md:
 * the red "10 Years Of Experience" roundel over the Powering Success
 * photograph. It was a red badge, which the redesign does not allow, and
 * the number had been wrong since 2022 — the page's own copy dates the
 * founding to 2012, and its H1 counts eighty combined years.
 *
 * The vision and mission that used to sit in a red card floating over the
 * hero are a band of their own now. They were invisible below md.
 */

const promises = [
  {
    title: "Certified Team",
    body: "Our certified professionals with years of experience and top industry credentials.",
  },
  {
    title: "Trusted Company",
    body: "With a proven track record, we deliver dependable, high-quality results every time.",
  },
] as const;

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="80+ Years of Collective IT Mastery"
        lead="Precision engineering for the enterprises that can't afford to guess."
        formation={5}
      />

      {/* Vision and mission, which the old page hid below md. */}
      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian w-full py-24 md:py-32"
        aria-label="Vision and mission"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-20 lg:px-8">
          <div className="border-t border-white/15 pt-8">
            <h2 className="type-telemetry text-silver-500">Our Vision</h2>
            <p className="type-body-l mt-6 max-w-[46ch] text-silver-100">
              To turn IT complexity into competitive advantage&mdash;simply,
              cost-effectively, and without compromise.
            </p>
          </div>
          <div className="border-t border-white/15 pt-8">
            <h2 className="type-telemetry text-silver-500">Our Mission</h2>
            <p className="type-body-l mt-6 max-w-[46ch] text-silver-100">
              To be the technology partner enterprises trust when the stakes are
              highest&mdash;delivering expertise, accountability, and results
              that compound.
            </p>
          </div>
        </div>
      </section>

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Your strategic technology partner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal as="h2" className="type-h2 max-w-[18ch] text-neutral-900">
                Your Strategic Technology Partner
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[60ch] text-neutral-600" delay={80}>
                At Inflexions I.T. Services, we don&apos;t just provide
                technology&mdash;we architect AI-integrated solutions that drive
                your specific business outcomes. Whether deploying machine
                learning for predictive operations, strengthening security with
                AI-driven threat detection, or enabling innovation through
                intelligent automation, we&apos;re your trusted guide through the
                complex IT landscape.
              </Reveal>
              <Reveal as="p" className="type-body-l mt-6 max-w-[60ch] text-neutral-600" delay={160}>
                Our privately-owned structure ensures agility, accountability, and
                accuracy in every engagement. We&apos;re sculpted for speed
                without sacrificing quality, delivering solutions that create
                lasting competitive advantages for businesses across Ghana and
                beyond.
              </Reveal>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/assets/about/strategy.webp"
                  alt="Strategic technology planning in modern conference room"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="photo-grade object-cover"
                />
              </div>
              <div className="relative mt-12 aspect-[3/4] overflow-hidden">
                <Image
                  src="/assets/about/Implementation.webp"
                  alt="IT professional in enterprise data centre"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="photo-grade object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering the Future. The photograph bleeds off the right edge on
          desktop, which is the one composition on the page worth keeping. */}
      <section
        data-register="obsidian"
        data-header-dark=""
        className="band-obsidian on-obsidian relative w-full overflow-hidden"
        aria-label="Engineering the future"
      >
        <div className="absolute right-0 top-0 hidden h-full w-1/2 lg:block">
          <Image
            src="/assets/about/aboutsect.webp"
            alt="Modern data centre with server infrastructure"
            fill
            sizes="50vw"
            className="photo-grade object-cover"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <div className="lg:w-1/2 lg:pr-16">
            <Reveal as="h2" className="type-h2 max-w-[20ch] text-silver-100">
              Engineering the Future, One Solution at a Time
            </Reveal>
            <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={80}>
              Founded in 2012 in Accra, Ghana, Inflexions I.T. Services was built
              on a singular conviction: the right technology, expertly
              implemented, is the inflexion point between stagnation and growth.
              Our core team brings decades of collective experience in IT systems
              integration.
            </Reveal>
            <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={160}>
              Today, we are the technology partner enterprises trust to navigate
              the AI era. We embed machine learning, AIOps, and intelligent
              automation into every solution we deliver&mdash;creating distinct
              competitive advantages, not incremental improvements.
            </Reveal>
            <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={240}>
              From our headquarters in Accra, we serve clients across Ghana with
              the ambition and capability to expand throughout West Africa. Our
              privately-owned structure means one thing: speed, accountability,
              and zero bureaucracy.
            </Reveal>
            <Reveal as="p" className="type-body-l mt-6 max-w-[56ch] text-silver-300" delay={320}>
              Every engagement is a turning point. We help enterprises move from
              reactive IT spending to strategic technology investment&mdash;and
              the results speak for themselves.
            </Reveal>

            <Reveal className="mt-10" delay={400}>
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center rounded-[6px] bg-primary-500 px-8 font-semibold text-white transition-colors duration-[var(--motion-duration-micro)] hover:bg-primary-600"
                >
                  Request Consultation
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        <div className="relative h-[300px] w-full lg:hidden">
          <Image
            src="/assets/about/aboutsect.webp"
            alt="Modern data centre with server infrastructure"
            fill
            sizes="100vw"
            className="photo-grade object-cover"
          />
        </div>
      </section>

      <section className="band-ivory w-full py-24 md:py-32" aria-label="Leadership">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="type-h2 max-w-[18ch] text-neutral-900">
            Leadership Built on Excellence
          </h2>
          <p className="type-body-l mt-6 max-w-[62ch] text-neutral-600">
            Technical mastery meets business acumen. Our leadership team ensures
            every client receives solutions engineered for their specific
            challenges&mdash;not off-the-shelf templates.
          </p>

          <div className="mt-16">
            <Leaders />
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Powering success">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 border-t border-neutral-200 pt-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="type-h2 max-w-[18ch] text-neutral-900">
                Powering Success Across Industries
              </h2>
              <p className="type-body-l mt-6 max-w-[56ch] text-neutral-600">
                From telecommunications giants to high-growth startups, leading
                organizations choose Inflexions for one reason: we deliver
                measurable results. Every engagement is tailored, every solution
                is proven.
              </p>

              <div className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
                {promises.map((promise) => (
                  <div key={promise.title} className="border-t border-neutral-200 pt-6">
                    <h3 className="type-h3 text-neutral-900">{promise.title}</h3>
                    <p className="type-body mt-3 text-neutral-600">{promise.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 border-t border-neutral-200 pt-8">
                <p className="type-telemetry text-neutral-500">
                  Ready to get started? Call us now
                </p>
                <p className="type-h2 mt-4 text-neutral-900">
                  <a
                    href="tel:+233208889270"
                    className="underline decoration-neutral-300 underline-offset-[6px] transition-colors duration-[var(--motion-duration-micro)] hover:decoration-neutral-900"
                  >
                    +233 208 889 270
                  </a>
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src="/assets/about/exp1.png"
                  alt="Team meeting"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="photo-grade object-cover"
                />
              </div>
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src="/assets/about/vvvvv.webp"
                  alt="Virtual reality experience"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="photo-grade object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band-ivory w-full pb-24 md:pb-32" aria-label="Clients">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-neutral-200 pt-12">
            <p className="type-eyebrow text-neutral-500">Our clients</p>
            <ClientRoster register="ivory" className="mt-10 md:mt-12" />
          </div>
        </div>
      </section>

      <section aria-label="Where we are">
        <div className="relative">
          <iframe
            title="Location map of East Legon, Accra"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.288220023456!2d-0.1540899!3d5.6350357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b4f2c00c7f7%3A0x6b44a2c2ff3284aa!2sDei%20Close%2C%20Accra!5e0!3m2!1sen!2sgh!4v1746185400000!5m2!1sen!2sgh"
            width="100%"
            height="450"
            className="block w-full h-[200px] sm:h-[300px] md:h-[450px]"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-4 left-1/2 z-10 w-[90%] -translate-x-1/2 bg-white p-6 sm:w-auto md:bottom-8 md:left-8 md:translate-x-0">
            <p className="type-telemetry text-neutral-500">Company address</p>
            <p className="type-h3 mt-4 text-neutral-900">
              #2 Dei Close
              <br />
              East Legon
              <br />
              Accra, Ghana
            </p>
          </div>
        </div>
      </section>

      <AskBand />
    </div>
  );
}

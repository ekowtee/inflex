import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-[#1B3764] mb-4">404</h1>
        <p className="text-xl text-[#41444B] mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="bg-[#BD2E25] hover:bg-[#A02923] text-white font-medium py-3 px-8 rounded-[6px] transition inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

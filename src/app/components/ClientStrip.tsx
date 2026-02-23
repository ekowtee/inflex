import Image from "next/image";

interface Client {
  id: number | string;
  name: string;
  logoPath: string;
  href?: string;
}

interface ClientStripProps {
  title?: string;
  bgColor?: string;
  // Making clients optional - it will use predefined list if not provided
  clients?: Client[];
}

export default function ClientStrip({
  title = "Trusted By Industry Leaders",
  bgColor = "bg-white",
  clients,
}: ClientStripProps) {
  // This hardcoded list will be used if no clients are provided
  const defaultClients: Client[] = [
    {
      id: 1,
      name: "CEIBS",
      logoPath: "/logos/CEIBS.png",
    },
    {
      id: 2,
      name: "Innovaddb",
      logoPath: "/logos/innovaddb.png",
    },
    {
      id: 3,
      name: "British Airways",
      logoPath: "/logos/ba.png",
    },
    {
      id: 4,
      name: "ATC",
      logoPath: "/logos/atc.svg",
    },
    {
      id: 5,
      name: "Blu",
      logoPath: "/logos/blu.png",
    },
    {
      id: 6,
      name: "Ninani",
      logoPath: "/logos/ninani.png",
    },
    {
      id: 7,
      name: "Lifeforms",
      logoPath: "/logos/lifeforms1.png",
    },
  ];

  // Use the provided clients or fall back to default list
  const displayClients = clients || defaultClients;

  return (
    <section className={`py-8 ${bgColor} border-t border-[#E6E6E6]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-center text-xl font-medium text-[#41444B] mb-8">
            {title}
          </h2>
        )}

        <div className="flex justify-between items-center space-x-8 overflow-x-auto py-2 sm:flex-wrap sm:justify-center">
          {displayClients.map((client) => (
            <div key={client.id} className="flex-shrink-0">
              {client.href ? (
                <a
                  href={client.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit ${client.name}`}
                  className="block transition-opacity duration-300 opacity-70 hover:opacity-100"
                >
                  <Image
                    src={client.logoPath}
                    alt={`${client.name} logo`}
                    width={120}
                    height={40}
                    className="object-contain h-8 sm:h-10 w-auto"
                  />
                </a>
              ) : (
                <div
                  title={client.name}
                  className="transition-opacity duration-300 opacity-70 hover:opacity-100"
                >
                  <Image
                    src={client.logoPath}
                    alt={`${client.name} logo`}
                    width={120}
                    height={40}
                    className="object-contain h-8 sm:h-10 w-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

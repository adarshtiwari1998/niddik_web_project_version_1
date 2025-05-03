import Container from "@/components/ui/container";

const companies = [
  { name: "Microsoft", logoUrl: "https://via.placeholder.com/150x60?text=Microsoft" },
  { name: "Goldman Sachs", logoUrl: "https://via.placeholder.com/150x60?text=Goldman+Sachs" },
  { name: "JP Morgan", logoUrl: "https://via.placeholder.com/150x60?text=JP+Morgan" },
  { name: "ViacomCBS", logoUrl: "https://via.placeholder.com/150x60?text=ViacomCBS" },
  { name: "GitHub", logoUrl: "https://via.placeholder.com/150x60?text=GitHub" },
  { name: "Coursera", logoUrl: "https://via.placeholder.com/150x60?text=Coursera" }
];

const TrustedCompanies = () => {
  return (
    <section className="py-12 bg-white">
      <Container>
        <p className="text-center text-lg text-andela-gray mb-10">
          Trusted by leading companies worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {companies.map((company, index) => (
            <div key={index} className="grayscale hover:grayscale-0 transition-all">
              <img 
                src={company.logoUrl} 
                alt={company.name} 
                className="h-10" 
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TrustedCompanies;

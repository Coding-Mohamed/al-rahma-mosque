// components/services.jsx
// Services section component - "Vad Vi Erbjuder"
// ============================================

export default function Services() {
  // All 8 services we offer - displayed in 4x4 grid (4 top row, 4 bottom row)
  const services = [
    {
      icon: "🕌",
      title: "Bön",
      description: "Dagliga böner och fredagsbön för gemenskapen.",
    },
    {
      icon: "🕋",
      title: "Hajj & Umrah",
      description: "Vägledning och stöd för pilgrimsfärd till Mekka.",
    },
    {
      icon: "💰",
      title: "Zakat",
      description: "Hjälp med att beräkna och distribuera zakat korrekt.",
    },
    {
      icon: "📖",
      title: "Koran Utlärning",
      description: "Koranklasser för alla åldrar och nivåer.",
    },
    {
      icon: "⚰️",
      title: "Begravning",
      description: "Fullständiga begravningstjänster enligt islamisk sed.",
    },
    {
      icon: "❤️",
      title: "Sadaqa",
      description: "Frivilliga gåvor för att hjälpa behövande.",
    },
    {
      icon: "🎓",
      title: "Utbildningskonsult",
      description: "Islamisk utbildning och rådgivning.",
    },
    {
      icon: "💍",
      title: "Nikkah/Vigselbevis",
      description: "Islamiska vigslar och vigselbevis enligt islamisk sed.",
    },
  ];

  return (
    <div className="bg-lighter py-2 px-4 rounded-lg">
      <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-10">Vad Vi Erbjuder</h2>

      {/* Grid: 4 columns on large screens, 2 on medium, 1 on mobile */}
      {/* Creates 2 rows of 4 items each */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-primary">
            {/* Large emoji icon */}
            <div className="text-5xl mb-4">{service.icon}</div>

            {/* Service title in primary blue */}
            <h3 className="font-bold text-lg text-primary mb-3">{service.title}</h3>

            {/* Service description */}
            <p className="text-main text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

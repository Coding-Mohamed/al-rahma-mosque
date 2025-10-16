// SETUP INSTRUCTIONS:
// 1. Install: npm install @emailjs/browser react-hook-form
// 2. Sign up at https://www.emailjs.com/
// 3. Get your: Service ID, Template ID, Public Key
// 4. Replace the IDs below with your actual EmailJS credentials

"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      contactReason: "general",
    },
  });

  // Sheikh information
  const sheikhs = [
    {
      id: 1,
      name: "Shaik Abdulaziz",
      title: "Huvudimam",
      phone: "0737739772",
      email: "info@alrahmamoske.se",
      initials: "SA",
    },
    {
      id: 2,
      name: "Shaik Rabei",
      title: "Rådgivare",
      phone: "0737409862",
      email: "info@alrahmamoske.se",
      initials: "SR",
    },
  ];

  const contactReasons = [
    { id: "general", name: "Allmän fråga" },
    { id: "religious", name: "Religiös rådgivning" },
    { id: "education", name: "Koranskola/Utbildning" },
    { id: "marriage", name: "Äktenskap/Nikah" },
    { id: "funeral", name: "Begravning" },
    { id: "donation", name: "Donationer" },
    { id: "event", name: "Evenemang/Bokning" },
  ];

  // Form submission with EmailJS
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // EmailJS configuration - Using environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      // Validate environment variables
      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration missing. Check environment variables.");
      }

      // Prepare template parameters
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone || "Ej angiven",
        contact_reason: contactReasons.find((r) => r.id === data.contactReason)?.name,
        subject: data.subject || "Inget specifikt ämne",
        message: data.message,
        to_email: "info@alrahmamoske.se", // Your mosque email
      };

      // Send email via EmailJS
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

      console.log("Email sent successfully:", response);
      setSubmitStatus("success");
      reset(); // Clear form

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Email send error:", error);
      setSubmitStatus("error");

      // Auto-hide error message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Kontakta oss</h1>
        <p className="text-lg text-main max-w-3xl mx-auto">Vi är här för att hjälpa dig med alla dina frågor. Kontakta våra sheikhs direkt eller skicka ett meddelande via formuläret nedan.</p>
      </div>

      {/* Sheikh Contact Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary text-center mb-8">Våra Sheikhs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {sheikhs.map((sheikh) => (
            <div key={sheikh.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-primary from-primary to-accent text-white p-6 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-accent backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/70">
                  <span className="text-2xl sm:text-3xl font-bold">{sheikh.initials}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{sheikh.name}</h3>
                <p className="text-lg opacity-90">{sheikh.title}</p>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4 p-3 bg-lighter rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">📞</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Telefon</p>
                    <a href={`tel:${sheikh.phone}`} className="text-primary font-semibold hover:text-accent transition-colors">
                      {sheikh.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-lighter rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">📧</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${sheikh.email}`} className="text-primary font-semibold hover:text-accent transition-colors break-all">
                      {sheikh.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Skicka meddelande</h2>

            {/* Success Message */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <p className="font-semibold">Tack för ditt meddelande!</p>
                    <p className="text-sm">Vi återkommer till dig snart.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">❌</span>
                  <div>
                    <p className="font-semibold">Ett fel uppstod</p>
                    <p className="text-sm">Försök igen eller kontakta oss direkt via telefon.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Namn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Namn är obligatoriskt",
                      minLength: { value: 2, message: "Namn måste vara minst 2 tecken" },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition-colors ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Ditt fullständiga namn"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email är obligatoriskt",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Ogiltig email-adress",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition-colors ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="din@email.se"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              {/* Phone and Contact Reason Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Telefon</label>
                  <input type="tel" {...register("phone")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors" placeholder="+46 70 123 45 67" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ämne <span className="text-red-500">*</span>
                  </label>
                  <select {...register("contactReason", { required: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors">
                    {contactReasons.map((reason) => (
                      <option key={reason.id} value={reason.id}>
                        {reason.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">Specifikt ämne</label>
                <input type="text" {...register("subject")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors" placeholder="Kortfattat ämne för ditt meddelande" />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meddelande <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("message", {
                    required: "Meddelande är obligatoriskt",
                    minLength: { value: 10, message: "Meddelandet måste vara minst 10 tecken" },
                  })}
                  rows="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition-colors resize-none ${errors.message ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Beskriv din fråga eller ditt ärende i detalj..."
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Skickar...
                  </>
                ) : (
                  "Skicka meddelande"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Al-Rahma Moské</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-3 mt-1 flex-shrink-0">📍</div>
                <div>
                  <p className="font-semibold">Adress</p>
                  <p className="text-sm text-gray-600">
                    Malmabergsgatan 23
                    <br />
                    721 30 Västerås
                    <br />
                    Sverige
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-3 mt-1 flex-shrink-0">📞</div>
                <div>
                  <p className="font-semibold">Huvudtelefon</p>
                  <a href="tel:0737739772" className="text-primary hover:text-accent transition-colors">
                    073-773 97 72
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-3 mt-1 flex-shrink-0">📧</div>
                <div className="min-w-0">
                  <p className="font-semibold">Email</p>
                  <a href="mailto:info@alrahmamoske.se" className="text-primary hover:text-accent transition-colors break-all text-sm">
                    info@alrahmamoske.se
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Öppettider</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Måndag - Torsdag</span>
                <span className="font-semibold">09:00 - 20:00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Fredag</span>
                <span className="font-semibold">09:00 - 22:00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Lördag - Söndag</span>
                <span className="font-semibold">10:00 - 18:00</span>
              </div>
              <div className="mt-4 p-3 bg-lighter rounded-lg">
                <p className="text-xs text-primary">
                  <strong>Obs:</strong> Fredagsbön kl. 13:00. Alla är välkomna!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Hitta hit</h2>
          <p className="text-main max-w-2xl mx-auto">Besök oss på Malmabergsgatan 23 i Västerås. Klicka på kartan för vägbeskrivning.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-primary">
          <div className="relative h-96 sm:h-[500px]">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2021.8234567890123!2d16.5462!3d59.6098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465e7e7e7e7e7e7e%3A0x7e7e7e7e7e7e7e7e!2sMalmabergsgatan%2023%2C%20721%2030%20V%C3%A4ster%C3%A5s!5e0!3m2!1sen!2sse!4v1234567890123!5m2!1sen!2sse" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Al-Rahma Moské - Västerås" className="absolute inset-0"></iframe>
          </div>

          <div className="p-6 bg-lighter">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-primary text-2xl mb-2">📍</div>
                <h3 className="font-semibold text-primary mb-1">Adress</h3>
                <p className="text-sm text-main">
                  Malmabergsgatan 23
                  <br />
                  721 30 Västerås
                </p>
              </div>

              <div>
                <div className="text-primary text-2xl mb-2">🚗</div>
                <h3 className="font-semibold text-primary mb-1">Parkering</h3>
                <p className="text-sm text-main">
                  Gratis parkering
                  <br />
                  finns tillgänglig
                </p>
              </div>

              <div>
                <div className="text-primary text-2xl mb-2">🚌</div>
                <h3 className="font-semibold text-primary mb-1">Kollektivtrafik</h3>
                <p className="text-sm text-main">
                  Buss 4, 12
                  <br />
                  Hållplats: Malmaberg
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a href="https://www.google.com/maps/dir/?api=1&destination=Malmabergsgatan+23,+721+30+Västerås,+Sweden" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors shadow-lg">
                <span className="mr-2">🧭</span>
                Få vägbeskrivning från min position
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

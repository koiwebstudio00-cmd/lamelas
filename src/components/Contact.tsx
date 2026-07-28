import React, { useState } from 'react';
import { Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { apiPost, TENANT_SLUG } from '../lib/api';
import WhatsAppIcon from './WhatsAppIcon';

// Sección combinada: sucursales (ex "Estamos cerca tuyo") + formulario de contacto
const contacts = [
  {
    name: 'San Miguel de Tucumán',
    detail: 'Junín 615, 1A',
    phone: '+54 381 2310357',
    tel: 'tel:+543812310357',
    whatsapp: 'https://wa.me/543812310357',
  },
  {
    name: 'Yerba Buena',
    detail: 'Av. Solano Vera esquina Mendoza',
    phone: '+54 381 2581179',
    tel: 'tel:+543812581179',
    whatsapp: 'https://wa.me/543812581179',
  },
  {
    name: 'Propiedades en Salta',
    detail: 'Sin oficina física — coordinamos por WhatsApp',
    phone: null,
    tel: null,
    whatsapp: 'https://wa.me/543812310357?text=Hola, quiero consultar por propiedades en Salta.',
  },
];

const MOTIVO_LABELS: Record<string, string> = {
  comprar: 'Quiero comprar',
  alquilar: 'Quiero alquilar',
  vender: 'Quiero vender',
  tasar: 'Quiero tasar mi propiedad',
  otro: 'Otro motivo',
};

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || sent) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const motivo = String(data.get('motivo') ?? '');
    const texto = String(data.get('mensaje') ?? '').trim();
    const telefono = String(data.get('telefono') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();

    if (!telefono && !email) {
      setError('Dejanos un teléfono o un email para poder responderte.');
      return;
    }

    setSending(true);
    setError(null);
    try {
      // El CRM guarda un solo campo de mensaje: el motivo elegido va como
      // encabezado para que el vendedor lo vea sin abrir la ficha.
      await apiPost(`/v1/public/${TENANT_SLUG}/leads`, {
        nombre: String(data.get('nombre') ?? '').trim(),
        email: email || undefined,
        telefono: telefono || undefined,
        mensaje: motivo ? `[${MOTIVO_LABELS[motivo] ?? motivo}] ${texto}` : texto,
        // Honeypot: si un bot lo completa, la API rechaza la consulta.
        website: String(data.get('website') ?? ''),
      });
      setSent(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No pudimos enviar tu consulta. Escribinos por WhatsApp y te respondemos igual.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Estamos cerca tuyo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance">Hablemos de tu próxima propiedad</h2>
            <p className="text-lg text-gray-600 mb-8 text-pretty">
              Escribile directo a la sucursal que te quede más cómoda, o dejanos tu consulta y nuestro equipo te contacta a la brevedad.
            </p>

            <ul className="divide-y divide-gray-200 border-y border-gray-200">
              {contacts.map((contact) => (
                <li key={contact.name} className="flex items-center justify-between gap-4 py-5">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{contact.name}</p>
                    <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin size={15} className="text-brand-primary shrink-0" aria-hidden="true" />
                      <span className="truncate">{contact.detail}</span>
                    </p>
                    {contact.phone && contact.tel && (
                      <a
                        href={contact.tel}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-primary transition-colors mt-1 tabular-nums"
                      >
                        <Phone size={15} className="text-brand-primary shrink-0" aria-hidden="true" />
                        {contact.phone}
                      </a>
                    )}
                  </div>
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp — ${contact.name}`}
                    className="group shrink-0 h-11 w-11 rounded-full bg-brand-light/70 text-brand-dark flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
                  >
                    <WhatsAppIcon className="h-[19px] w-[19px] group-hover:text-white" />
                  </a>
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-500 mt-6">
              Lunes a viernes de 9 a 18 h. Por WhatsApp te respondemos también fuera de horario.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Dejanos tu mensaje</h3>
              {sent && (
                <div role="status" aria-live="polite" className="mb-6 flex items-center gap-3 bg-brand-light text-brand-dark font-medium p-4 rounded-md">
                  <CheckCircle2 size={20} className="shrink-0" aria-hidden="true" />
                  ¡Recibimos tu consulta! Te contactamos dentro del día.
                </div>
              )}
              {error && (
                <div role="alert" className="mb-6 flex items-center gap-3 bg-red-50 text-red-700 font-medium p-4 rounded-md">
                  <AlertCircle size={20} className="shrink-0" aria-hidden="true" />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot: oculto para personas, tentador para bots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-nombre" className="text-sm font-medium text-gray-700">Nombre completo</label>
                    <input id="contact-nombre" name="nombre" required type="text" autoComplete="name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="Ej. Juan Pérez" />
                  </div>
	                  <div className="space-y-2">
	                    <label htmlFor="contact-telefono" className="text-sm font-medium text-gray-700">Teléfono</label>
	                    <input id="contact-telefono" name="telefono" type="tel" autoComplete="tel" aria-describedby="contact-info-hint" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="Código de área + número" />
	                  </div>
	                </div>
	
	                <div className="space-y-2">
	                  <label htmlFor="contact-email" className="text-sm font-medium text-gray-700">Email</label>
	                  <input id="contact-email" name="email" type="email" autoComplete="email" aria-describedby="contact-info-hint" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="tu@email.com" />
	                </div>

	                <p id="contact-info-hint" className="text-sm text-gray-500 -mt-3">
	                  Dejá al menos un dato de contacto: teléfono o email.
	                </p>

                <div className="space-y-2">
                  <label htmlFor="contact-motivo" className="text-sm font-medium text-gray-700">Motivo de consulta</label>
                  <select id="contact-motivo" name="motivo" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-700">
                    <option value="">Seleccionar…</option>
                    <option value="comprar">Quiero comprar</option>
                    <option value="alquilar">Quiero alquilar</option>
                    <option value="vender">Quiero vender</option>
                    <option value="tasar">Quiero tasar mi propiedad</option>
                    <option value="otro">Otro motivo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-mensaje" className="text-sm font-medium text-gray-700">Mensaje</label>
                  <textarea id="contact-mensaje" name="mensaje" required rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none" placeholder="Escribí tu consulta acá…"></textarea>
                </div>

                <button type="submit" disabled={sending || sent} className="w-full bg-gray-900 text-white font-bold py-4 rounded-md hover:bg-brand-primary transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none">
                  {sent ? 'Consulta enviada' : sending ? 'Enviando…' : 'Enviar consulta'}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

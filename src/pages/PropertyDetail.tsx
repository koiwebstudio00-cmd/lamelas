import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, LayoutGrid, Share2, Loader2, ImageOff, CheckCircle2, AlertCircle, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { Property, OPERACION_LABELS, TIPO_LABELS } from '../types';
import { fetchPropertyBySlug, imageUrl, sortedImages, formatPrice, locationLine, coverUrl } from '../lib/properties';
import { useSeo } from '../lib/seo';
import { apiPost, TENANT_SLUG } from '../lib/api';

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    setLoading(true);
    setSent(false);
    setSending(false);
    setError(null);
    setGalleryIndex(0);
    if (!slug) {
      setProperty(null);
      setLoading(false);
      return;
    }
    fetchPropertyBySlug(slug)
      .then(data => {
        if (!cancelled) setProperty(data);
      })
      .catch(() => {
        if (!cancelled) setProperty(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // SEO por propiedad (el hook corre siempre; con property null usa el fallback)
  useSeo({
    title: property ? property.titulo : 'Propiedad',
    description: property
      ? (property.descripcion?.slice(0, 160) ??
        `${TIPO_LABELS[property.tipo]} en ${OPERACION_LABELS[property.operacion].toLowerCase()}${property.ciudad ? ` en ${property.ciudad}` : ''}. ${formatPrice(property.precio, property.moneda)}.`)
      : undefined,
    image: property ? (coverUrl(property) ?? undefined) : undefined,
    imageAlt: property ? `Foto de ${property.titulo}` : undefined,
    jsonLd: property
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: property.titulo,
          description: property.descripcion ?? undefined,
          image: coverUrl(property) ?? undefined,
          offers: {
            '@type': 'Offer',
            price: property.precio,
            priceCurrency: property.moneda,
            availability: 'https://schema.org/InStock',
          },
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center text-brand-primary">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-16">
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center max-w-md mx-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Propiedad no encontrada</h1>
          <p className="text-gray-600 mb-6">Puede que ya no esté disponible o que el enlace sea incorrecto.</p>
          <Link
            to="/propiedades"
            className="inline-block bg-brand-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-dark transition-colors"
          >
            Ver propiedades disponibles
          </Link>
        </div>
      </div>
    );
  }

  const images = sortedImages(property);
  const location = locationLine(property);

  const features = [
    property.sup_total != null && { icon: Maximize, label: 'Superficie Total', value: `${property.sup_total} m²` },
    property.sup_cubierta != null && { icon: Maximize, label: 'Sup. Cubierta', value: `${property.sup_cubierta} m²` },
    property.ambientes != null && { icon: LayoutGrid, label: 'Ambientes', value: `${property.ambientes}` },
    property.dormitorios != null && { icon: Bed, label: 'Dormitorios', value: `${property.dormitorios}` },
    property.banios != null && { icon: Bath, label: 'Baños', value: `${property.banios}` },
  ].filter(Boolean) as { icon: typeof Bed; label: string; value: string }[];

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: property.titulo, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || sent) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const nombre = String(data.get('nombre') ?? '').trim();
    const telefono = String(data.get('telefono') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const mensaje = String(data.get('mensaje') ?? '').trim();

    if (!telefono && !email) {
      setError('Dejanos un teléfono o un email para poder responderte.');
      return;
    }

    setSending(true);
    setError(null);
    try {
      await apiPost(`/v1/public/${TENANT_SLUG}/leads`, {
        nombre,
        telefono: telefono || undefined,
        email: email || undefined,
        mensaje: `[Consulta propiedad] ${property.titulo} (${window.location.href})\n\n${mensaje}`,
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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">

        {/* Breadcrumb & Actions */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/propiedades"
              className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-3.5 py-2 rounded-lg shadow-sm hover:border-brand-primary hover:text-brand-primary transition-colors"
            >
              <ChevronLeft size={17} aria-hidden="true" />
              Volver
            </Link>
            <div className="text-sm text-gray-500 font-medium truncate hidden sm:block">
              <Link to="/propiedades" className="hover:text-brand-primary">Propiedades</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{TIPO_LABELS[property.tipo]}</span>
            </div>
          </div>
          <button
            onClick={share}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors text-sm font-medium"
          >
            <Share2 size={18} />
            Compartir
          </button>
        </div>

        {/* Title & Key Info */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row justify-between gap-6 items-start">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                {OPERACION_LABELS[property.operacion]}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                {TIPO_LABELS[property.tipo]}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {property.titulo}
            </h1>
            {location && (
              <p className="flex items-center gap-2 text-gray-600 text-lg">
                <MapPin size={20} className="text-brand-primary" />
                {location}
              </p>
            )}
          </div>
          <div className="lg:text-right">
            <div className="text-3xl md:text-4xl font-bold text-brand-dark mb-1 tabular-nums">
              {formatPrice(property.precio, property.moneda)}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">

            {/* Gallery: imagen principal + controles + miniaturas */}
            {images.length > 0 ? (
              <div>
                <div className="relative rounded-2xl overflow-hidden h-[320px] md:h-[480px] bg-gray-100 group">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(galleryIndex)}
                    aria-label="Ver foto en pantalla completa"
                    className="h-full w-full cursor-zoom-in"
                  >
                    <img
                      key={galleryIndex}
                      src={imageUrl(images[galleryIndex])}
                      alt={`${property.titulo} — foto ${galleryIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setGalleryIndex((galleryIndex - 1 + images.length) % images.length)}
                        aria-label="Foto anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm text-gray-900 shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronLeft size={24} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setGalleryIndex((galleryIndex + 1) % images.length)}
                        aria-label="Foto siguiente"
                        className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm text-gray-900 shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronRight size={24} aria-hidden="true" />
                      </button>
                    </>
                  )}

                  {/* Contador + pantalla completa */}
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1.5 rounded-md tabular-nums" aria-live="polite">
                    {galleryIndex + 1} / {images.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(galleryIndex)}
                    className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white transition-colors"
                  >
                    <Images size={16} aria-hidden="true" />
                    Pantalla completa
                  </button>
                </div>

                {/* Miniaturas: seleccionan la foto principal */}
                {images.length > 1 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setGalleryIndex(i)}
                        aria-label={`Ver foto ${i + 1}`}
                        aria-current={i === galleryIndex}
                        className={`shrink-0 h-16 w-24 md:h-20 md:w-28 rounded-lg overflow-hidden ring-2 transition-all ${
                          i === galleryIndex ? 'ring-brand-primary opacity-100' : 'ring-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imageUrl(img)}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-200 h-[300px] flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ImageOff size={48} className="mx-auto mb-2" />
                  <p className="font-medium">Sin fotos disponibles</p>
                </div>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Características principales</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {features.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="bg-brand-light p-3 rounded-full text-brand-primary">
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="font-bold text-gray-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {property.descripcion && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {property.descripcion.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Map Placeholder — oculto por ahora (pedido jul 2026); reactivar cuando haya mapa real */}
            {false && location && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ubicación aproximada</h2>
                <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #9ca3af 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                  <div className="z-10 bg-white/90 p-4 rounded-full shadow-lg text-brand-primary">
                    <MapPin size={32} />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar / Contact */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Consultar por esta propiedad</h3>

              {sent && (
                <div role="status" aria-live="polite" className="mb-4 flex items-center gap-3 bg-brand-light text-brand-dark font-medium p-4 rounded-md">
                  <CheckCircle2 size={20} className="shrink-0" aria-hidden="true" />
                  ¡Recibimos tu consulta! Te contactamos dentro del día.
                </div>
              )}
              {error && (
                <div id="inquiry-error" role="alert" className="mb-4 flex items-center gap-3 bg-red-50 text-red-700 font-medium p-4 rounded-md">
                  <AlertCircle size={20} className="shrink-0" aria-hidden="true" />
                  {error}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleInquirySubmit}>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <div>
                  <label htmlFor="inquiry-nombre" className="sr-only">Nombre completo</label>
                  <input id="inquiry-nombre" name="nombre" required type="text" autoComplete="name" placeholder="Nombre completo" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                </div>
                <div>
                  <label htmlFor="inquiry-telefono" className="sr-only">Teléfono</label>
                  <input id="inquiry-telefono" name="telefono" type="tel" autoComplete="tel" placeholder="Teléfono" aria-describedby="inquiry-contact-hint inquiry-error" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                </div>
                <div>
                  <label htmlFor="inquiry-email" className="sr-only">Email</label>
                  <input id="inquiry-email" name="email" type="email" autoComplete="email" placeholder="Email" aria-describedby="inquiry-contact-hint inquiry-error" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                </div>
                <p id="inquiry-contact-hint" className="text-xs text-gray-500 -mt-2">
                  Dejá al menos un dato de contacto: teléfono o email.
                </p>
                <div>
                  <label htmlFor="inquiry-mensaje" className="sr-only">Mensaje</label>
                  <textarea id="inquiry-mensaje" name="mensaje" required rows={4} placeholder="Hola, me interesa esta propiedad…" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"></textarea>
                </div>
                <button type="submit" disabled={sending || sent} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-md hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:pointer-events-none">
                  {sent ? 'Consulta enviada' : sending ? 'Enviando…' : 'Consultar por esta propiedad'}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gray-200"></div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">O contactanos vía</span>
                <div className="h-[1px] flex-1 bg-gray-200"></div>
              </div>

              <a
                href={`https://wa.me/543812310357?text=${encodeURIComponent(`Hola, quiero consultar por la propiedad: ${property.titulo} (${window.location.href})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full bg-brand-primary text-white font-bold py-3.5 rounded-md hover:bg-brand-dark transition-colors"
              >
                <WhatsAppIcon className="h-5 w-5 text-white" />
                WhatsApp Directo
              </a>
            </div>
          </div>

        </div>

      </div>

      <Lightbox
        images={images.map(imageUrl)}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        title={property.titulo}
      />
    </div>
  );
}

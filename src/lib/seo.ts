import { useEffect } from 'react';

const SITE_NAME = 'Lamelas y Chaumont';
const DEFAULT_IMAGE = 'https://i.postimg.cc/k4nQNJQq/hero.webp';
const DEFAULT_IMAGE_ALT = 'Foto institucional de Lamelas y Chaumont';

interface SeoOptions {
  /** Título sin el sufijo de marca (se agrega solo). */
  title: string;
  description?: string;
  /** URL absoluta de imagen para compartir (og:image). */
  image?: string;
  /** Texto alternativo de la imagen al compartir. */
  imageAlt?: string;
  /** JSON-LD específico de la página (ej. la propiedad en el detalle). */
  jsonLd?: object;
}

function setMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) {
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * SEO por ruta en una SPA: actualiza title, description, Open Graph,
 * canonical y (opcional) JSON-LD al montar la página.
 */
export function useSeo({ title, description, image, imageAlt, jsonLd }: SeoOptions) {
  // Serializado para comparar por valor (el objeto cambia de identidad en cada render)
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const shareImage = image || DEFAULT_IMAGE;
    const shareImageAlt = imageAlt || DEFAULT_IMAGE_ALT;
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', window.location.href);
    setMeta('property', 'og:image', shareImage);
    setMeta('property', 'og:image:alt', shareImageAlt);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:locale', 'es_AR');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', shareImage);
    setMeta('name', 'twitter:image:alt', shareImageAlt);

    // Canonical: URL sin query params (filtros/paginación no son canónicos)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}`;

    // JSON-LD de la página (se reemplaza al navegar)
    const LD_ID = 'page-jsonld';
    document.getElementById(LD_ID)?.remove();
    if (jsonLdStr) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = LD_ID;
      script.textContent = jsonLdStr;
      document.head.appendChild(script);
    }
    return () => {
      document.getElementById(LD_ID)?.remove();
    };
  }, [title, description, image, imageAlt, jsonLdStr]);
}

import React, { useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface LightboxProps {
  images: string[];
  /** Índice de la foto abierta; null = cerrado */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
}

export default function Lightbox({ images, index, onClose, onNavigate, title }: LightboxProps) {
  const isOpen = index !== null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  // Teclado + bloqueo del scroll de fondo
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {isOpen && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={title ? `Fotos de ${title}` : 'Galería de fotos'}
          className="fixed inset-0 z-[80] bg-black/95 flex flex-col overscroll-contain"
          onClick={onClose}
        >
          {/* Barra superior: contador + cerrar */}
          <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-medium tabular-nums" aria-live="polite">
              {index + 1} / {images.length}
            </span>
            <button
              onClick={onClose}
              aria-label="Cerrar galería"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={26} aria-hidden="true" />
            </button>
          </div>

          {/* Imagen */}
          <div className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0" onClick={(e) => e.stopPropagation()}>
            <img
              key={index}
              src={images[index]}
              alt={title ? `${title} — foto ${index + 1}` : `Foto ${index + 1}`}
              className="max-h-full max-w-full object-contain select-none"
              draggable={false}
            />
          </div>

          {/* Navegación */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Foto anterior"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
              >
                <ChevronLeft size={28} aria-hidden="true" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Foto siguiente"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>
            </>
          )}

          {/* Tira de miniaturas */}
          {images.length > 1 && (
            <div
              className="flex gap-2 p-4 overflow-x-auto justify-start md:justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => onNavigate(i)}
                  aria-label={`Ir a la foto ${i + 1}`}
                  aria-current={i === index}
                  className={`shrink-0 h-14 w-20 rounded-md overflow-hidden ring-2 transition-all ${
                    i === index ? 'ring-white opacity-100' : 'ring-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" draggable={false} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

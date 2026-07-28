interface WhatsAppIconProps {
  className?: string;
}

export default function WhatsAppIcon({ className = 'h-5 w-5' }: WhatsAppIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current text-[#25D366] ${className}`}
      style={{
        mask: 'url(/icons/whatsapp.svg) center / contain no-repeat',
        WebkitMask: 'url(/icons/whatsapp.svg) center / contain no-repeat',
      }}
    />
  );
}

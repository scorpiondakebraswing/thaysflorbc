type PetalMotifProps = {
  className?: string;
};

/**
 * Elemento de assinatura visual da marca — uma pétala/linha orgânica minimalista.
 * Usado como acento decorativo (não como ícone funcional).
 */
export default function PetalMotif({ className = "" }: PetalMotifProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M60 8C78 28 92 46 92 66C92 88 78 104 60 112C42 104 28 88 28 66C28 46 42 28 60 8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M60 20C60 50 60 82 60 108"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

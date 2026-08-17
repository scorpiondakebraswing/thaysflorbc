/**
 * Silhueta genérica usada como avatar quando o depoimento ainda não tem foto.
 * Traço suave e arredondado, combinando com a estética da marca.
 */
export default function AvatarSilhouette({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="28" cy="28" r="28" className="fill-wine-100" />
      <circle cx="28" cy="22" r="8.5" className="fill-wine-700/35" />
      <path
        d="M12.5 47.5c1.6-8.2 8.1-13.5 15.5-13.5s13.9 5.3 15.5 13.5"
        className="fill-wine-700/35"
      />
    </svg>
  );
}

export default function BrandMark({ compact = false }) {
  return (
    <span className={`brand-lockup${compact ? " brand-lockup-compact" : ""}`}>
      <svg className="brand-mark" viewBox="0 0 44 44" role="img" aria-label="DrOSAlchemist mark">
        <path className="mark-path" d="M10 8.5h12l12 13.5-12 13.5H10L22 22 10 8.5Z" />
        <path className="mark-path mark-path-second" d="M34 8.5H22L10 22l12 13.5h12L22 22 34 8.5Z" />
        <circle className="mark-core" cx="22" cy="22" r="3.2" />
      </svg>
      {!compact && <span className="brand-wordmark">DrOS<span>Alchemist</span></span>}
    </span>
  );
}
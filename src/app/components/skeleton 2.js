import styles from "./skeleton.module.css";

export default function Skeleton({
  width = "100%",
  height = 16,
  radius,
  className = "",
  style,
  ariaLabel = "Carregando",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={`${styles.skeleton} ${className}`.trim()}
      style={{
        width,
        height,
        ...(radius !== undefined ? { borderRadius: radius } : null),
        ...style,
      }}
    />
  );
}

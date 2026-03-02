export function Tag({ children, color = "purple", className = "" }) {
  const colorClass = `tag-${color}`;
  return (
    <span className={`tag ${colorClass} ${className}`}>
      {children}
    </span>
  );
}

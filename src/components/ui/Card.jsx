export function Card({ children, className = "", title, ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  );
}

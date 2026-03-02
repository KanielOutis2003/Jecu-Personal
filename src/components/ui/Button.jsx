export function Button({ children, className = "", variant = "primary", size = "", ...props }) {
  const baseClass = "btn";
  const variantClass = variant === "primary" ? "btn-primary" : variant === "outline" ? "btn-outline" : variant === "danger" ? "btn-danger" : "";
  const sizeClass = size === "sm" ? "btn-sm" : "";
  
  return (
    <button className={`${baseClass} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

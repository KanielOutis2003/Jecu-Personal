export function Input({ className = "", as = "input", ...props }) {
  const Component = as;
  return (
    <Component className={`input ${className}`} {...props} />
  );
}

const Button = ({
  onClick,
  type = "button",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-2 py-1 mx-1  rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

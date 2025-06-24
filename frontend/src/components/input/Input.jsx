import { useId } from "react";

export const Input = ({
  type,
  placeholder = "Enter here",
  className = "",
  label,
  id,
  ...props
}) => {
  const ids = useId();
  return (
    <div className="w-full flex flex-wrap px-4 mt-5 justify-between items-center">
      {label && (
        <label className={``} htmlFor={id || ids}>
          {label}
        </label>
      )}
      <input
        id={id || ids}
        type={type}
        ref={props.ref}
        placeholder={placeholder}
        className={`px-3 py-0.5 border rounded w-4/6  bg-white text-black outline-none  ${className}`}
        {...props}
      />
    </div>
  );
};

import clsx from "clsx";
import { forwardRef } from "react";

const InputItem = forwardRef(
  (
    { label = "Label", className, type = "text", error, required, ...props },
    ref
  ) => {
    return (
      <div className={clsx("sm:col-span-3", className)}>
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          id={label}
          type={type}
          autoComplete="off"
          className="mt-1 flex-1 block w-full min-w-0 rounded-md sm:text-sm border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

export default InputItem;

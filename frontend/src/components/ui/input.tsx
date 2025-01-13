interface IProps {
  label?: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "bg-white text-black",
}: IProps) => {
  const handleOnChange = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
        className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black sm:text-sm"
      />
    </div>
  );
};

export default Input;

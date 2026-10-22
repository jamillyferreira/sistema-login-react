import type { ComponentProps } from "react";

// & é um operador de interseção de tipos em TypeScript. Ele é usado para combinar dois ou mais tipos em um único tipo. No caso do InputFieldProps, ele combina as propriedades do componente <input> HTML com as propriedades adicionais definidas no objeto literal { label: string; iconClassName: string; id: string; }.
type InputFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  icon: string;
  error?: string;
};

function InputField({ id, label, icon, error, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="text-gray-600 block mb-1" htmlFor={id}>
        {label}
      </label>

      <div
        className={`flex items-center gap-2.5 border rounded-md p-2.5 transition-colors 
          ${error ? "border-red-500" : "border-gray-400 focus-within:border-gray-500"}`}
      >
        <i className={`ph ${icon} text-gray-500`}></i>
        <input
          className="w-full outline-none"
          // propos sera passado para o componente InputField, permitindo que ele aceite todas as propriedades válidas de um elemento <input> HTML, como type, value, onChange, etc.
          {...props}
          id={id}
        />
      </div>
      {error && (
        <small className="text-xs text-red-500 mt-1 block">{error}</small>
      )}
    </div>
  );
}

export default InputField;

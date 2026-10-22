import type { ComponentProps } from "react";

// ComponentProps é um tipo genérico que representa as propriedades de um componente React.
// é preciso importar o tipo ComponentProps do React para poder tipar as propriedades do componente Button corretamente.
// é usado para garantir que o componente Button aceite todas as propriedades válidas de um elemento <button> HTML, como onClick, disabled, etc.

// children já vem incluído no tipo ComponentProps<"button">, então não é necessário declará-lo explicitamente.
function Button({ children, ...props }: ComponentProps<"button">) {
  return (
    <button
      className="bg-purple-600 py-2.5 rounded-md text-white font-semibold cursor-pointer hover:bg-purple-700 transition-colors mt-2.5"
      {...props}
    >
      {/* children é uma propriedade que representa o conteudo que sera
      renderizado dentro do componente Btnton. No caso do componente Button,
      children é usado para renderizar o texto ou elementos que serão exibidos
      dentro do botão. 
      */}
      {children}
    </button>
  );
}

export default Button;

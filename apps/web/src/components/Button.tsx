import React from 'react';

interface ButtonProps {
    text: string;
    border?: string;
    background?: string;
    textColor?: string;
    textHover?: string;
}

const Button: React.FC<ButtonProps> = ({ text, border = "#77af9c", background = "#77af9c", textColor= "black", textHover="white" }) => {
  return (
      <button
        className="relative border-2 rounded-full z-10 cursor-pointer whitespace-nowrap lg:px-12 px-4 py-2 transition-colors duration-300"
        style={{
          backgroundColor: "transparent",
          borderColor: border,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = background, e.currentTarget.style.color = textHover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent", e.currentTarget.style.color = textColor)}
      >
        {text}
      </button>
  );
};

export default Button;

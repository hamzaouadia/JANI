import React from 'react';

interface ButtonProps {
    text: string;
    border?: string;
    background?: string;
    textColor?: string;
    textHover?: string;
    backgroundHover?: string;
}

function Button({ text, border = "#8b4513", background = "#f7f3e8", backgroundHover = "#8b4513", textColor= "#3d2914", textHover="#f7f3e8" }: ButtonProps) {
  return (
      <button
        className="relative border-2 rounded-full z-10 cursor-pointer whitespace-nowrap lg:px-12 px-4 py-2 transition-colors duration-300"
        style={{
          backgroundColor: background,
          borderColor: border,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = backgroundHover, e.currentTarget.style.color = textHover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = background, e.currentTarget.style.color = textColor)}
      >
        {text}
      </button>
  );
}

export default Button;
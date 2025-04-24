
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  const quizTopics = [
    { topic: "ADDITION", link: "/addition/settings" },
    { topic: "SUBTRACTION", link: "/subtraction/settings" },
    { topic: "MULTIPLICATION", link: "/multiplication/settings" },
    { topic: "DIVISION", link: "/division/settings" },
    { topic: "ROOT & SQUARE", link: "" },
    { topic: "TABLE", link: "" },
    { topic: "SIMPLIFICATION", link: "" },
    { topic: "ALGEBRA", link: "" },
    { topic: "GEOMETRY", link: "" },
  ];

  const handleItemClick = (topic: string, link: string) => {
    if (!link) return;
    
    setActiveItem(topic);
    setTimeout(() => {
      navigate(link);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#f0f4f8] to-[#d0e1f9]">
      <header className="w-full text-center bg-gradient-to-r from-[#4c6ef5] to-[#3b5bdb] text-white py-6 flex items-center justify-center shadow-lg z-10">
        <h1 className="text-2xl font-bold tracking-wide m-0">Calc Quiz</h1>
      </header>

      <main className="w-[90%] max-w-[600px] text-center py-8 mt-2 pb-12">
        <div className="sticky top-0 bg-[#f0f4f8] py-4 mb-5 z-20">
          <h2 className="text-2xl font-semibold inline-block pb-2 relative text-[#2b3a55] m-0 after:content-[''] after:w-[70px] after:h-1 after:bg-[#4c6ef5] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:rounded-md">
            Basic Calculation
          </h2>
        </div>
        
        <ul className="list-none p-0 m-0 relative z-10">
          {quizTopics.map((item, index) => (
            <li
              key={index}
              className={`bg-white/90 rounded-xl my-4 px-6 py-[18px] flex justify-between items-center cursor-pointer transition-all duration-300 shadow-md relative overflow-hidden border-l-[5px] ${
                activeItem === item.topic
                  ? "bg-[rgba(231,237,255,0.95)] border-l-[#4c6ef5] shadow-[0_0_20px_rgba(76,110,245,0.25)]"
                  : "border-l-transparent hover:translate-y-[-3px] hover:shadow-lg hover:border-l-[#4c6ef5]"
              }`}
              onClick={() => handleItemClick(item.topic, item.link)}
            >
              <span className={`text-xl font-semibold text-[#2d3748] transition-all duration-300 relative z-2 ${
                activeItem === item.topic ? "text-[#4c6ef5]" : "hover:translate-x-[5px] hover:text-[#4c6ef5]"
              }`}>
                {item.topic}
              </span>
              <span className={`w-3 h-3 border-r-[3px] border-t-[3px] border-[#4c6ef5] rotate-45 transition-all duration-300 relative z-2 mr-[5px] ${
                activeItem === item.topic ? "opacity-100" : "opacity-0 hover:opacity-100"
              }`}></span>
              <div className="absolute w-full h-full bg-gradient-to-br from-transparent to-[rgba(76,110,245,0.03)] top-0 left-0 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Index;

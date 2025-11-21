import React from "react";
import { useNavigate } from "react-router-dom";

// Asset URLs (use import.meta.url to ensure Vite resolves special characters safely)
const assets = {
  c: new URL("../assets/c.png", import.meta.url).href,
  cpp: new URL("../assets/c++.png", import.meta.url).href,
  // '#' in filenames can cause tooling issues; use a safe filename 'Csharp.png'
  csharp: new URL("../assets/Csharp.png", import.meta.url).href,
  java: new URL("../assets/java.png", import.meta.url).href,
  js: new URL("../assets/js.png", import.meta.url).href,
  htmlcss: new URL("../assets/htmlcss.jpeg", import.meta.url).href,
  python: new URL("../assets/python.jpeg", import.meta.url).href,
  php: new URL("../assets/php.jpeg", import.meta.url).href,
}

const Compiler = () => {
  const navigate = useNavigate();

  const compilers = [
    { id: 1, name: "C Online Compiler", url: "https://www.programiz.com/c-programming/online-compiler/", image: assets.c },
    { id: 2, name: "C++ Online Compiler", url: "https://www.programiz.com/cpp-programming/online-compiler/", image: assets.cpp },
    { id: 3, name: "Java Online Compiler", url: "https://www.programiz.com/java-programming/online-compiler/", image: assets.java },
    { id: 4, name: "Python Online Compiler", url: "https://www.programiz.com/python-programming/online-compiler/", image: assets.python },
    { id: 5, name: "HTML & CSS Editor", url: "https://www.programiz.com/html/online-compiler/", image: assets.htmlcss },
    { id: 6, name: "JS Editor", url: "https://www.programiz.com/javascript/online-compiler/", image: assets.js },
    { id: 7, name: "C# Online Compiler", url: "https://dotnetfiddle.net/", image: assets.csharp },
    { id: 8, name: "PHP Online Compiler", url: "https://www.programiz.com/php/online-compiler/", image: assets.php },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Code Editors</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {compilers.map((compiler) => (
            <article
              key={compiler.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition p-4 flex flex-col"
            >
              <div className="h-40 rounded-md bg-white flex items-center justify-center border border-gray-200 overflow-hidden">
                {compiler.image ? (
                  <img
                    src={compiler.image}
                    alt={`${compiler.name} preview`}
                    className="w-full h-full object-contain p-3 bg-white"
                    style={{ objectPosition: 'center center' }}
                  />
                ) : (
                  <span className="text-gray-300">Preview</span>
                )}
              </div>

              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{compiler.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Open the external online editor for quick testing.</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">External</span>
                  {compiler.url ? (
                    <a
                      href={compiler.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-md hover:opacity-95"
                    >
                      Open ↗
                    </a>
                  ) : (
                    <button disabled className="px-4 py-2 bg-gray-200 text-gray-500 rounded-full" />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Compiler;

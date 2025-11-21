import React from "react";
import { useNavigate } from "react-router-dom";

const Study = () => {
  const navigate = useNavigate();

  // Map study names to local asset files (fall back safely if missing)
  const assets = {
    Java: (() => { try { return new URL("../assets/java.png", import.meta.url).href } catch(e) { return null } })(),
    Python: (() => { try { return new URL("../assets/python.jpeg", import.meta.url).href } catch(e) { return null } })(),
    C: (() => { try { return new URL("../assets/c.png", import.meta.url).href } catch(e) { return null } })(),
    "C++": (() => { try { return new URL("../assets/c++.png", import.meta.url).href } catch(e) { return null } })(),
    "Machine Learning": (() => { try { return new URL("../assets/ML.jpeg", import.meta.url).href } catch(e) { return null } })(),
    "Parallel Computing": (() => { try { return new URL("../assets/PC.jpeg", import.meta.url).href } catch(e) { return null } })(),
    "C#": (() => { try { return new URL("../assets/Csharp.png", import.meta.url).href } catch(e) { return null } })(),
    DevOps: (() => { try { return new URL("../assets/devops.jpeg", import.meta.url).href } catch(e) { return null } })(),
    "Data Science": (() => { try { return new URL("../assets/data sci.jpeg", import.meta.url).href } catch(e) { return null } })(),
    Linux: (() => { try { return new URL("../assets/Linux.jpeg", import.meta.url).href } catch(e) { return null } })(),
    "Data Structures": (() => { try { return new URL("../assets/DS.png", import.meta.url).href } catch(e) { return null } })(),
    "Operating Systems": (() => { try { return new URL("../assets/os.jpeg", import.meta.url).href } catch(e) { return null } })(),
    "Computer Networks": (() => { try { return new URL("../assets/web.jpeg", import.meta.url).href } catch(e) { return null } })(),
    "Database Management": (() => { try { return new URL("../assets/dbms.jpeg", import.meta.url).href } catch(e) { return null } })(),
    "Web Development": (() => { try { return new URL("../assets/web.jpeg", import.meta.url).href } catch(e) { return null } })(),
    "Artificial Intelligence": (() => { try { return new URL("../assets/AI.jpeg", import.meta.url).href } catch(e) { return null } })(),
  };

  const studyMaterials = [
    { id: 1, name: "Java", url: "https://www.geeksforgeeks.org/java/" },
    { id: 2, name: "Python", url: "https://www.geeksforgeeks.org/python-programming-language/" },
    { id: 3, name: "C", url: "https://www.geeksforgeeks.org/c-programming-language/" },
    { id: 4, name: "C++", url: "https://www.geeksforgeeks.org/c-plus-plus/" },
    { id: 5, name: "Machine Learning", url: "https://www.geeksforgeeks.org/machine-learning/" },
    { id: 6, name: "Parallel Computing", url: "https://www.geeksforgeeks.org/parallel-computing/" },
    { id: 7, name: "C#", url: "https://www.geeksforgeeks.org/c-sharp-programming-language/" },
    { id: 8, name: "DevOps", url: "https://www.geeksforgeeks.org/devops/" },
    { id: 9, name: "Data Science", url: "https://www.geeksforgeeks.org/data-science/" },
    { id: 10, name: "Linux", url: "https://www.geeksforgeeks.org/linux/" },
    { id: 11, name: "Data Structures", url: "https://www.geeksforgeeks.org/data-structures/" },
    { id: 12, name: "Operating Systems", url: "https://www.geeksforgeeks.org/operating-systems/" },
    { id: 13, name: "Computer Networks", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
    { id: 14, name: "Database Management", url: "https://www.geeksforgeeks.org/dbms-tutorials/" },
    { id: 15, name: "Web Development", url: "https://www.w3schools.com/" },
    { id: 16, name: "Artificial Intelligence", url: "https://www.geeksforgeeks.org/artificial-intelligence/" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Study Resources</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyMaterials.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all flex flex-col border border-transparent hover:border-gray-100 overflow-hidden"
            >
              <div className="h-48 sm:h-56 lg:h-64 rounded-md bg-gradient-to-br from-gray-100 to-gray-50 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {assets[item.name] ? (
                  <img
                    src={assets[item.name]}
                    alt={`${item.name} preview`}
                    className="w-full h-full object-contain p-4 bg-white rounded-md shadow-inner"
                  />
                ) : (
                  <span className="text-gray-300">Preview</span>
                )}
              </div>

              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Curated tutorials and notes.</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">External</span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:opacity-95"
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

export default Study;

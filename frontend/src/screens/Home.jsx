import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";

// local assets — prefer code.jpg if present, otherwise fall back to code.svg
const assets = {
  code: (() => {
    try {
      return new URL("../assets/code.jpg", import.meta.url).href;
    } catch (e) {
      return new URL("../assets/code.svg", import.meta.url).href;
    }
  })(),
  study: (() => { try { return new URL("../assets/study.jpeg", import.meta.url).href } catch(e) { return null } })(),
  news: (() => { try { return new URL("../assets/news.jpeg", import.meta.url).href } catch(e) { return null } })(),
};

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);

  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();

    if (!projectName.trim()) {
      console.warn("⚠️ Project name is empty");
      alert("Please enter a project name");
      return;
    }

    axios
      .post("/projects/create", { name: projectName })
      .then((res) => {
        setIsModalOpen(false);
        setProjectName("");
        return axios.get("/projects/all");
      })
      .then((res) => {
        if (res) setProject(res.data.projects);
      })
      .catch((error) => {
        const serverMessage =
          error.response?.data?.message ||
          (Array.isArray(error.response?.data?.errors)
            ? error.response.data.errors.map((e) => e.msg).join(", ")
            : null);

        console.error("❌ Error creating project:", error.response?.data || error.message);
        alert("Failed to create project: " + (serverMessage || error.message));
      });
  }

  function handleLogout() {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    axios
      .delete(`/projects/${id}`)
      .then(() => {
        setProject((prev) => prev.filter((p) => p._id !== id));
      })
      .catch((err) => console.error("Delete failed", err));
  }

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => setProject(res.data.projects || []))
      .catch((err) => console.log(err));
  }, []);

  const featureCards = [
    { id: "compiler", title: "Code Compiler", subtitle: "Write & run code online", route: "/compiler" },
    { id: "study", title: "Study Material", subtitle: "Online notes & resources", route: "/study" },
    { id: "news", title: "Live News", subtitle: "Latest tech & updates", route: "/news" },
  ];

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 flex justify-start items-start relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 z-10"
      >
        Logout
      </button>

      {/* Left column (projects) */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 ml-8 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Your Projects</h1>
          <span className="text-sm text-gray-500">Quick access</span>
        </div>

        <div className="flex justify-center mb-6">
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow hover:scale-[1.02] transform transition">
            <i className="ri-add-line mr-2"></i>
            Create New Project
          </button>
        </div>

        {project.length === 0 ? (
          <div className="text-center text-gray-700 font-medium">No projects yet</div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-1">
            {project.map((p) => (
              <div
                key={p._id}
                className="relative bg-white rounded-lg p-4 hover:shadow-sm cursor-pointer flex items-center gap-4"
                onClick={() => navigate("/project", { state: { project: p } })}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {p.name && p.name[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-md font-semibold truncate">{p.name}</h2>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <i className="ri-user-line" />
                    <span>Collaborators: {Array.isArray(p.users) ? p.users.length : 0}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-md"
                    title="Delete"
                  >
                    <i className="ri-delete-bin-6-line text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right column (feature cards) */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card) => (
            <div
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(card.route)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate(card.route)
              }}
              className="block cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative"
            >
              <div className="w-full h-56 bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                {card.id === 'compiler' ? (
                  <img
                    src={assets.code}
                    alt="Code compiler preview"
                    className="w-full h-full object-contain p-4 bg-white"
                    style={{ objectPosition: 'center center' }}
                  />
                ) : card.id === 'study' && assets.study ? (
                  <img src={assets.study} alt="Study material preview" className="w-full h-full object-contain p-4 bg-white" />
                ) : card.id === 'news' && assets.news ? (
                  <img src={assets.news} alt="Live news preview" className="w-full h-full object-contain p-4 bg-white" />
                ) : (
                  <span className="text-gray-400">{card.title} Preview</span>
                )}
              </div>

              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-sm mt-1 text-gray-600">{card.subtitle}</p>

              <div className="absolute bottom-4 right-4">
                <button
                  type="button"
                  onClick={(e) => {
                    // avoid triggering parent click twice
                    e.stopPropagation();
                    navigate(card.route);
                  }}
                  className="text-sm px-3 py-1 bg-[#673ab7] text-white rounded hover:bg-[#5e35b1]"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h2 className="text-xl mb-4 font-semibold">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#673ab7] text-white rounded-md hover:bg-[#5e35b1]">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;

// frontend/src/Dashboard.jsx
import { useState, useEffect } from 'react';
import api from './api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');

  const userRole = localStorage.getItem('role');

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async () => {
    try {
      await api.post('/projects', { name: "Launch Campaign", description: "Main project" });
      fetchData();
    } catch (err) {
      alert("Error creating project");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description,
        status: "pending",
        project_id: parseInt(projectId)
      });
      setTitle('');
      setDescription('');
      fetchData();
    } catch (err) {
      alert("Error creating task. Ensure the Project ID exists!");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status?status=${newStatus}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Not authorized to update this task");
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading your workspace...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
      
      {/* 🌟 TASK BOARD - Left Side (Scaled Up) */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600">
            Active Tasks
          </h2>
          <span className="bg-indigo-100 text-indigo-700 font-bold py-2 px-5 rounded-full text-base lg:text-lg">
            {tasks.length} Total
          </span>
        </div>
        
        {tasks.length === 0 && (
          <div className="bg-white/50 backdrop-blur-sm p-16 rounded-3xl shadow-sm border border-slate-200 border-dashed text-center">
            <span className="text-6xl block mb-4">📋</span>
            <h3 className="text-3xl font-bold text-slate-700">Your board is clear</h3>
            <p className="text-lg text-slate-500 mt-3">Initialize a project and assign tasks to see them here.</p>
          </div>
        )}

        <div className="space-y-6">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="group bg-white backdrop-blur-md p-8 rounded-3xl shadow-md border-2 border-slate-300 flex justify-between items-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-400"
            >
              <div>
                <h3 className="font-extrabold text-2xl text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {task.title}
                </h3>
                <p className="text-slate-500 text-base lg:text-lg mt-2 mb-6">{task.description}</p>
                
                <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-sm ${
                  task.status === 'done' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                  task.status === 'in_progress' ? 'bg-sky-100 text-sky-700 border border-sky-200' : 
                  'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    task.status === 'done' ? 'bg-emerald-500' : 
                    task.status === 'in_progress' ? 'bg-sky-500' : 
                    'bg-amber-500'
                  }`}></span>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <select 
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className="p-4 border-2 border-slate-100 rounded-xl text-base bg-slate-50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 font-semibold cursor-pointer transition-all"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 ADMIN CONSOLE - Right Side (Scaled Up) */}
      <div>
        {userRole === 'admin' ? (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-10 rounded-3xl shadow-2xl text-white border border-slate-700/50 sticky top-10">
            <h3 className="font-bold text-3xl mb-8 flex items-center gap-4 border-b border-slate-700/50 pb-6">
              <span className="text-indigo-400 text-4xl">👑</span> Command Center
            </h3>

            {projects.length === 0 ? (
              <button 
                onClick={handleCreateProject} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white p-5 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
              >
                + Initialize First Project
              </button>
            ) : (
              <div className="mb-10 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/50">
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Active Project</p>
                <p className="font-bold text-2xl text-emerald-400 flex items-center gap-3">
                  #{projects[0].id} <span className="text-white">{projects[0].name}</span>
                </p>
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Task Details</label>
                <input required type="text" placeholder="New Task Title" className="w-full p-4 rounded-2xl text-base text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/50 border-0" value={title} onChange={e=>setTitle(e.target.value)}/>
              </div>
              <input required type="text" placeholder="Description (e.g. Write the API endpoints)" className="w-full p-4 rounded-2xl text-base text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/50 border-0" value={description} onChange={e=>setDescription(e.target.value)}/>
              <div className="flex gap-4">
                <input required type="number" placeholder="Project ID" className="w-1/3 p-4 rounded-2xl text-base text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/50 border-0" value={projectId} onChange={e=>setProjectId(e.target.value)}/>
                <button type="submit" className="w-2/3 bg-indigo-500 hover:bg-indigo-400 text-white p-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-slate-200 shadow-sm text-center sticky top-10">
            <span className="text-6xl block mb-4">👋</span>
            <h3 className="font-bold text-slate-800 text-3xl mb-3">Team Member View</h3>
            <p className="text-lg text-slate-500 leading-relaxed">You can update the status of tasks assigned to you using the dropdown menus. Project creation is restricted to Admins.</p>
          </div>
        )}
      </div>

    </div>
  );
}
import { useState } from "react";
import { X } from "lucide-react";
import { useLoadTables } from "../../api/hooks/databaseConnectionHooks";
import { toast } from "react-toastify";

const DatabseConnectionForm = ({ onBack, onSucces}) => {
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    database: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { host, port, username, password, database } = formData;
    if (!host || !port || !username || !password || !database) {
      toast.error("All fields must be completed!");
      return;
    }

    loadTables({
      host,
      port: parseInt(port, 10),
      username,
      password,
      database: database,
    });
  };

  const { mutate: loadTables, } = useLoadTables({
    onSuccess: (data) => {
      onSucces(data.tables, formData); 
    },    
    onError: (error) => {
      console.error("Connection Error:", error);
      toast.error("Connection Error!");
    },
  });

  return (
    <div className="bg-black p-6 rounded-xl text-white w-full max-w-2xl relative">
      <button 
        onClick={onBack} 
        className=" cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X size={24} />
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Database Connection</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Host</label>
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={handleChange}
              className="w-full p-2 rounded  border  text-white"
              placeholder="localhost"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Port</label>
            <input
              type="text"
              name="port"
              value={formData.port}
              onChange={handleChange}
              className="w-full p-2 rounded  border  text-white"
              placeholder="1521"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 rounded  border  text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded  border  text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Database</label>
            <input
              type="text"
              name="database"
              value={formData.database}
              onChange={handleChange}
              className="w-full p-2 rounded  border  text-white"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            onClick={handleSubmit}
            className="cursor-pointer px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded font-medium transition-colors"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabseConnectionForm;
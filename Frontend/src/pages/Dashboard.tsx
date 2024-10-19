import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useConversion } from '../contexts/ConversionContext';
import { FileText, BarChart2, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useConversion();

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Conversions</h2>
            <FileText size={24} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Storage Used</h2>
            <BarChart2 size={24} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">2.5 GB</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Account Type</h2>
            <Settings size={24} className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold">Free</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Conversions</h2>
        {tasks.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">File Name</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="py-2">{task.fileName}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent conversions.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
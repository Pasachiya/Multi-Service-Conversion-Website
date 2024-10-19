import React, { createContext, useContext, useState } from 'react';

interface ConversionTask {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
}

interface ConversionContextType {
  tasks: ConversionTask[];
  addTask: (fileName: string) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  updateTaskStatus: (id: string, status: ConversionTask['status']) => void;
}

const ConversionContext = createContext<ConversionContextType | undefined>(undefined);

export const useConversion = () => {
  const context = useContext(ConversionContext);
  if (context === undefined) {
    throw new Error('useConversion must be used within a ConversionProvider');
  }
  return context;
};

export const ConversionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<ConversionTask[]>([]);

  const addTask = (fileName: string) => {
    const newTask: ConversionTask = {
      id: Date.now().toString(),
      fileName,
      status: 'pending',
      progress: 0,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTaskProgress = (id: string, progress: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, progress } : task
      )
    );
  };

  const updateTaskStatus = (id: string, status: ConversionTask['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  return (
    <ConversionContext.Provider value={{ tasks, addTask, updateTaskProgress, updateTaskStatus }}>
      {children}
    </ConversionContext.Provider>
  );
};
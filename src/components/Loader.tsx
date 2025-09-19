import React from "react";

const Loader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-500">{message}</span>
    </div>
  );
};

export default Loader;

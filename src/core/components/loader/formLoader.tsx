import React from "react";

const FormLoader = () => {
  return (
    <div>
      <div className="border shadow rounded-md p-4 max-w-sm w-full mx-auto">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-10 bg-slate-700 rounded"></div>
            <div className="h-10 bg-slate-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 bg-slate-700 rounded col-span-2"></div>
                <div className="h-10 bg-slate-700 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLoader;


import React from 'react';

export default function Footer(){ 
  return (
    <footer className="bg-green-800 text-white py-4 mt-8">
      <div className="max-w-5xl mx-auto text-center">
        <div className="text-sm">© {new Date().getFullYear()} FarmCap — Original owner: Walter Timothy</div>
      </div>
    </footer>
  );
}

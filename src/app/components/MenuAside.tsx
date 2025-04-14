"use client";

import { useState } from 'react';
import { FiHome, FiCalendar, FiClipboard, FiMenu } from 'react-icons/fi';
import Link from 'next/link';

export function MenuAside() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu size={24} />
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 lg:w-64 w-[250px] shadow-lg lg:relative fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-green-600">Nutr.IA</h2>
        </div>
        
        <nav className="p-4 space-y-2">
          <div className="mb-6">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 px-3">
              Principal
            </p>
            <ul className="space-y-1">
              <li>
                <Link href="/dashboard" className="flex items-center gap-3 text-gray-700 hover:bg-green-50 hover:text-green-600 p-3 rounded-md transition-colors group">
                  <FiHome className="text-gray-500 group-hover:text-green-600" size={18} />
                  <span>Início</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="flex items-center gap-3 text-gray-700 hover:bg-green-50 hover:text-green-600 p-3 rounded-md transition-colors group">
                  <FiClipboard className="text-gray-500 group-hover:text-green-600" size={18} />
                  <span>Criar Dieta</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 text-gray-700 hover:bg-green-50 hover:text-green-600 p-3 rounded-md transition-colors group">
                  <FiCalendar className="text-gray-500 group-hover:text-green-600" size={18} />
                  <span>Histórico</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
'use client';

import { Bell, Search, User, ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-8 backdrop-blur-xl">
      
      {/* SEARCH BAR - TỐI GIẢN */}
      <div className="relative w-96 group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
        <input 
          type="text" 
          placeholder="Tìm kiếm mọi thứ..." 
          className="w-full rounded-xl border-none bg-gray-50 py-2 pl-10 pr-4 text-xs font-medium outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-black transition-all"
        />
      </div>

      {/* RIGHT ACTIONS - PROFILE SECTION */}
      <div className="flex items-center gap-6">
        
        {/* NOTIFICATIONS */}
        <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-black transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        {/* PREMIUM BADGE (EXTRA) */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-600 border border-emerald-100">
          <Sparkles className="h-3 w-3" />
          PRO ACCOUNT
        </div>

        {/* USER PROFILE BẢN ĐẲNG CẤP */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-1.5 pr-4 shadow-sm hover:border-black transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white font-bold shadow-lg shadow-gray-200">
            A
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-black text-black leading-none">EduCore Admin</span>
            <span className="text-[10px] font-bold text-gray-400 mt-0.5">Quản trị viên</span>
          </div>
          <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
        </motion.button>

      </div>
    </header>
  );
}

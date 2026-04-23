import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Wine, Monitor, Play, Settings, Trash2 } from 'lucide-react';

// --- Types ---
interface AppItem {
  id: string;
  name: string;
}

interface Bottle {
  id: string;
  name: string;
  version: string;
}

// --- Sortable Item Component ---
const SortableApp = ({ app }: { app: AppItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: app.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative flex flex-col items-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-800 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform">
        <Monitor className="text-white" size={32} />
      </div>
      <span className="text-slate-200 text-sm font-medium text-center truncate w-full px-2">
        {app.name}
      </span>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <Play size={14} className="text-emerald-400 fill-emerald-400" />
      </div>
    </div>
  );
};

// --- Main View Component ---
export const WineeryView = () => {
  const [bottles] = useState<Bottle[]>([
    { id: 'b1', name: 'Steam-Gaming', version: 'Wine 9.0' },
    { id: 'b2', name: 'Adobe-Suite', version: 'Wine 8.21' },
    { id: 'b3', name: 'Old-Legacy-Apps', version: 'Wine 7.0' },
  ]);

  const [apps, setApps] = useState<AppItem[]>([
    { id: '1', name: 'Cyberpunk 2077' },
    { id: '2', name: 'Elden Ring' },
    { id: '3', name: 'Notion (Win)' },
    { id: '4', name: 'Visual Studio' },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setApps((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar: Bottles */}
      <aside className="w-72 bg-slate-900/50 border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
            <Wine className="text-rose-500" /> 밥똥이리호요
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {bottles.map((bottle) => (
            <div
              key={bottle.id}
              className={`p-3 rounded-lg flex items-center justify-between group cursor-pointer transition-colors ${
                bottle.id === 'b1' ? 'bg-rose-500/10 border border-rose-500/20' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-rose-600 rounded-full" />
                <div>
                  <div className="text-sm font-semibold">{bottle.name}</div>
                  <div className="text-xs text-slate-500">{bottle.version}</div>
                </div>
              </div>
              <Settings size={14} className="text-slate-600 opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content: Apps Grid */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md">
          <h2 className="text-lg font-medium">Installed Applications</h2>
          <button className="text-xs bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-md transition-colors">
            Install New App
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={apps} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {apps.map((app) => (
                  <SortableApp key={app.id} app={app} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </main>
    </div>
  );
};
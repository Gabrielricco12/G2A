import React from 'react';
import { UploadCloud, FileText, Trash2, Download } from 'lucide-react';

export function EmployeeDocumentsTab({ employeeId }) {
  // Mock temporário enquanto implementamos o upload real no Storage
  const documents = [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
           <UploadCloud size={32} className="text-blue-500" />
        </div>
        <h4 className="text-lg font-bold text-slate-700">Upload de Documentos</h4>
        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Arraste ASO, CAT, Laudos ou outros arquivos relacionados a este funcionário.</p>
      </div>

      <div className="space-y-3">
        {documents.length === 0 ? (
           <p className="text-center text-slate-400 text-sm mt-4">Nenhum documento arquivado.</p>
        ) : (
           documents.map((doc, idx) => (
             <div key={idx} className="flex items-center justify-between p-4 bg-white/60 border border-slate-200 rounded-xl">
               {/* Lista de Docs */}
             </div>
           ))
        )}
      </div>
    </div>
  );
}
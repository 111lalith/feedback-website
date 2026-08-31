import React, { useState, useEffect } from 'react';
import { 
  History, 
  RotateCcw, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Calendar,
  Users,
  Database,
  FileText
} from 'lucide-react';
import { 
  getDeletedHistory, 
  restoreDeletedHistory, 
  deleteHistoryItem 
} from '../lib/firebase';
import { DeletedHistoryItem } from '../types';

interface HistoryArchiveViewProps {
  onDataRestored?: () => void;
}

export const HistoryArchiveView: React.FC<HistoryArchiveViewProps> = ({ onDataRestored }) => {
  const [historyItems, setHistoryItems] = useState<DeletedHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [purgingId, setPurgingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const items = await getDeletedHistory();
      setHistoryItems(items);
    } catch (err: any) {
      console.error('Error fetching deletion history:', err);
      setMessage({ type: 'error', text: 'Failed to load archive history' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRestore = async (item: DeletedHistoryItem) => {
    if (!item.id) return;
    const confirmRestore = window.confirm(
      `Are you sure you want to restore ${item.type === 'single_student' ? item.studentName || 'this student' : 'the entire database backup'}? This will restore all associated records back to active database.`
    );
    if (!confirmRestore) return;

    setRestoringId(item.id);
    setMessage(null);
    try {
      const res = await restoreDeletedHistory(item.id);
      setMessage({ 
        type: 'success', 
        text: `Restored successfully! ${res.restoredStudents} student(s) and ${res.restoredReviews} review(s) returned to active status.` 
      });
      await fetchHistory();
      if (onDataRestored) onDataRestored();
    } catch (err: any) {
      console.error('Restore error:', err);
      setMessage({ type: 'error', text: err?.message || 'Failed to restore record.' });
    } finally {
      setRestoringId(null);
    }
  };

  const handlePermanentDelete = async (historyId: string) => {
    const confirmPurge = window.confirm(
      'Permanent Warning: This will permanently delete this archive record from storage. This action cannot be undone. Proceed?'
    );
    if (!confirmPurge) return;

    setPurgingId(historyId);
    try {
      await deleteHistoryItem(historyId);
      setMessage({ type: 'success', text: 'History record permanently removed.' });
      await fetchHistory();
    } catch (err: any) {
      console.error('Purge error:', err);
      setMessage({ type: 'error', text: 'Failed to permanently remove history record.' });
    } finally {
      setPurgingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#0d0d0d] border border-zinc-800 p-6 rounded-2xl glow-accent-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
              Audit & Safety Archive
            </span>
          </div>
          <h2 className="text-lg font-bold text-white font-sans mt-1 flex items-center gap-2">
            <History className="w-5 h-5 text-[#B0FF00]" />
            Deleted Data History & Restoration Vault
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">
            All deleted individual student records and full database wipes are automatically preserved here. You can inspect deleted data, restore them back to the active database at any time, or permanently purge them.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-[#B0FF00] border border-zinc-800 text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#B0FF00]' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {/* Message notification */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-mono flex items-center justify-between border ${
          message.type === 'success' 
            ? 'bg-[#B0FF00]/10 border-[#B0FF00]/40 text-[#B0FF00]' 
            : 'bg-red-950/40 border-red-500/50 text-red-300'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* History List */}
      <div className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3 font-mono text-xs text-zinc-400">
            <RefreshCw className="w-6 h-6 text-[#B0FF00] animate-spin mx-auto" />
            <p>Loading deletion history records...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="p-12 text-center space-y-2 font-mono text-zinc-500">
            <History className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-sm text-zinc-400 font-sans">No Deleted Records in History</p>
            <p className="text-xs text-zinc-600">Whenever you delete a student or reset database records, backup snapshots appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {historyItems.map((item) => {
              const isExpanded = expandedId === item.id;
              const isDatabaseWipe = item.type === 'entire_database';

              return (
                <div key={item.id} className="p-4 sm:p-5 hover:bg-black/50 transition-colors">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
                        isDatabaseWipe 
                          ? 'bg-red-950/40 border-red-500/40 text-red-400' 
                          : 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                      }`}>
                        {isDatabaseWipe ? <Database className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                            isDatabaseWipe 
                              ? 'bg-red-950 text-red-300 border-red-800' 
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                          }`}>
                            {isDatabaseWipe ? 'Database Wipe Snapshot' : 'Single Student Deletion'}
                          </span>
                          
                          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.deletedAt).toLocaleString()}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white font-sans">
                          {isDatabaseWipe ? (
                            <span>Full Database Wipe Snapshot ({item.studentCount} Students, {item.reviewCount} Reviews)</span>
                          ) : (
                            <span>{item.studentName || 'Student'} <span className="text-zinc-400 font-mono font-normal">({item.idCardNo})</span></span>
                          )}
                        </h3>

                        <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-3 pt-0.5">
                          <span>Students: <strong className="text-zinc-200">{item.studentCount}</strong></span>
                          <span>•</span>
                          <span>Reviews: <strong className="text-[#B0FF00]">{item.reviewCount}</strong></span>
                          <span>•</span>
                          <span className="text-zinc-500">Deleted by: {item.deletedBy}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center font-mono text-xs">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id!)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>{isExpanded ? 'Hide Details' : 'View Data'}</span>
                      </button>

                      <button
                        onClick={() => handleRestore(item)}
                        disabled={restoringId === item.id}
                        className="px-3 py-1.5 rounded-lg bg-black hover:bg-[#B0FF00] border border-[#B0FF00] text-[#B0FF00] hover:text-black font-semibold flex items-center gap-1.5 text-[11px] transition-all glow-accent cursor-pointer disabled:opacity-50"
                        title="Restore all records in this snapshot back to active Firestore"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${restoringId === item.id ? 'animate-spin' : ''}`} />
                        <span>Restore</span>
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(item.id!)}
                        disabled={purgingId === item.id}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors cursor-pointer"
                        title="Permanently remove snapshot from archive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Expanded Accordion: Data Inspector */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-zinc-800/80 bg-black/60 rounded-xl p-4 space-y-4">
                      
                      {/* Students inside archive */}
                      {item.students && item.students.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#B0FF00]" />
                            Archived Student Records ({item.students.length}):
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {item.students.map((s) => (
                              <div key={s.id} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 text-xs font-mono">
                                <div className="font-bold text-white">{s.name}</div>
                                <div className="text-[11px] text-zinc-400">ID: {s.idCardNo}</div>
                                <div className="text-[10px] text-[#B0FF00]">{s.course} • Year {s.year} • Sec {s.section}</div>
                                <div className="text-[10px] text-zinc-500">{s.stream}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reviews inside archive */}
                      {item.reviews && item.reviews.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            Archived Reviews ({item.reviews.length}):
                          </h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {item.reviews.map((r) => (
                              <div key={r.id} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 text-xs">
                                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-b border-zinc-900 pb-1 mb-1">
                                  <span>{r.studentName} ({r.idCardNo}) - Day {r.day}</span>
                                  <span className="text-[#B0FF00] font-bold">{r.overallRating}/5 ★</span>
                                </div>
                                <p className="text-zinc-300 font-sans text-xs">
                                  <strong className="font-mono text-[#B0FF00] text-[10px]">Liked:</strong> "{r.liked}"
                                </p>
                                {r.improve && (
                                  <p className="text-zinc-400 font-sans text-xs mt-0.5">
                                    <strong className="font-mono text-amber-400 text-[10px]">Improvement:</strong> "{r.improve}"
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

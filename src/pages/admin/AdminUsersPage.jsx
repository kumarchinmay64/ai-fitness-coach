import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Users,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  Ban,
  Eye,
  Activity,
  Plus
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  // Add Athlete Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAthlete, setNewAthlete] = useState({ name: '', email: '', goal: 'Muscle Hypertrophy & Posture' });
  const [addingAthlete, setAddingAthlete] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await api.admin.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    setActionError(null);
    try {
      const updated = await api.admin.toggleUserStatus(userId);
      setUsers([...updated]);
    } catch (err) {
      console.error(err);
      setActionError(err.message || 'Failed to update account status.');
    }
  };

  const handleAddAthleteSubmit = async (e) => {
    e.preventDefault();
    if (!newAthlete.name.trim() || !newAthlete.email.trim()) return;

    try {
      setAddingAthlete(true);
      setActionError(null);
      const created = await api.admin.addAthleteSlot(newAthlete);
      setUsers([created, ...users]);
      setShowAddModal(false);
      setNewAthlete({ name: '', email: '', goal: 'Muscle Hypertrophy & Posture' });
    } catch (err) {
      console.error(err);
      setActionError(err.message || 'Failed to add athlete account.');
    } finally {
      setAddingAthlete(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <LoadingSpinner message="Retrieving athlete roster..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Action Error Banner */}
      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="neutral" size="sm">
            ATHLETE ROSTER
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Athlete Management & Status
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage registered members, active training slots, and account standings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add Athlete Slot
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          {['All', 'Active', 'Suspended', 'Pending'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === status
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                  : 'bg-dark-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card variant="glass" className="p-0 overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 border-b border-slate-800 text-slate-400 text-[11px] uppercase">
              <tr>
                <th className="px-5 py-4">Athlete</th>
                <th className="px-5 py-4">Fitness Focus</th>
                <th className="px-5 py-4">Workouts</th>
                <th className="px-5 py-4">Avg Accuracy</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-200">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {user.goal}
                  </td>
                  <td className="px-5 py-4 text-slate-300 font-mono">
                    {user.workoutsCompleted} sessions
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                    {user.avgAccuracy ? `${user.avgAccuracy}%` : '-- %'}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'neutral' : 'danger'}
                      size="sm"
                      dot
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      title="View Profile Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        user.status === 'Active'
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                      title={user.status === 'Active' ? 'Suspend Access' : 'Reactivate User'}
                    >
                      {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={selectedUser.name}
          description={`Athlete ID: ${selectedUser.id} • Registered: ${selectedUser.joinedDate}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Workouts</span>
                <span className="font-mono text-base font-bold text-white">
                  {selectedUser.workoutsCompleted}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Form Accuracy</span>
                <span className="font-mono text-base font-bold text-emerald-400">
                  {selectedUser.avgAccuracy ? `${selectedUser.avgAccuracy}%` : '--'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className={`font-bold ${selectedUser.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-800 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Training Goal</span>
              <p className="text-slate-300">{selectedUser.goal}</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Athlete Slot Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Athlete Slot"
        description="Create a new athlete record in the local coaching directory."
      >
        <form onSubmit={handleAddAthleteSubmit} className="space-y-4">
          <Input
            label="Athlete Full Name"
            placeholder="e.g. Jordan Miller"
            value={newAthlete.name}
            onChange={(e) => setNewAthlete({ ...newAthlete, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. jordan.m@example.com"
            value={newAthlete.email}
            onChange={(e) => setNewAthlete({ ...newAthlete, email: e.target.value })}
            required
          />
          <Input
            label="Training Focus Goal"
            placeholder="e.g. Muscle Hypertrophy & Posture"
            value={newAthlete.goal}
            onChange={(e) => setNewAthlete({ ...newAthlete, goal: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={addingAthlete}>
              Create Athlete Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

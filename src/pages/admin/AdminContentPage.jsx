import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  Dumbbell,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminContentPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Legs / Lower Body',
    difficulty: 'Intermediate',
    equipment: 'Barbell & Squat Rack',
    defaultSets: 4,
    defaultReps: 10,
    restSeconds: 90,
    formCues: 'Drive through heels, maintain neutral spine',
    commonMistakes: 'Knee valgus collapse'
  });

  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        const data = await api.workouts.getExercises();
        setExercises(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadExercises();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        difficulty: formData.difficulty,
        equipment: formData.equipment,
        defaultSets: Number(formData.defaultSets),
        defaultReps: Number(formData.defaultReps),
        restSeconds: Number(formData.restSeconds),
        formCues: typeof formData.formCues === 'string' ? formData.formCues.split(',').map((s) => s.trim()) : formData.formCues,
        commonMistakes: typeof formData.commonMistakes === 'string' ? formData.commonMistakes.split(',').map((s) => s.trim()) : formData.commonMistakes,
        targetMuscles: ['Quadriceps', 'Glutes', 'Core']
      };

      if (editingExercise) {
        const updated = await api.admin.updateExercise(editingExercise.id, payload);
        setExercises((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const created = await api.admin.addExercise(payload);
        setExercises((prev) => [created, ...prev]);
      }

      setShowAddModal(false);
      setEditingExercise(null);
      setFormData({
        name: '',
        category: 'Legs / Lower Body',
        difficulty: 'Intermediate',
        equipment: 'Barbell & Squat Rack',
        defaultSets: 4,
        defaultReps: 10,
        restSeconds: 90,
        formCues: 'Drive through heels, maintain neutral spine',
        commonMistakes: 'Knee valgus collapse'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exercise from system library?')) return;
    try {
      const remaining = await api.admin.deleteExercise(id);
      setExercises([...remaining]);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (ex) => {
    setEditingExercise(ex);
    setFormData({
      name: ex.name,
      category: ex.category,
      difficulty: ex.difficulty,
      equipment: ex.equipment,
      defaultSets: ex.defaultSets,
      defaultReps: ex.defaultReps,
      restSeconds: ex.restSeconds,
      formCues: Array.isArray(ex.formCues) ? ex.formCues.join(', ') : ex.formCues,
      commonMistakes: Array.isArray(ex.commonMistakes) ? ex.commonMistakes.join(', ') : ex.commonMistakes
    });
    setShowAddModal(true);
  };

  const filteredExercises = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono">
        <LoadingSpinner message="Accessing biomechanical repository..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="neutral" size="sm">
            EXERCISE DATABASE
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Movement Catalog Slots
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage kinematic angle thresholds, sets, reps, and form correction cues.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingExercise(null);
            setShowAddModal(true);
          }}
        >
          Add Movement Slot
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter movements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-dark-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Exercises Table */}
      <Card variant="dark" className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="px-5 py-4">Exercise Name</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Difficulty</th>
                <th className="px-5 py-4">Prescribed Volume</th>
                <th className="px-5 py-4">Equipment</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredExercises.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-200">
                    {ex.name}
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {ex.category}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="success" size="sm">
                      {ex.difficulty}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-300">
                    {ex.defaultSets} sets &bull; {ex.defaultReps} reps
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {ex.equipment}
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(ex)}
                      className="p-1.5 rounded-lg bg-dark-800 text-slate-300 hover:text-cyan-400 hover:bg-dark-750 transition-colors"
                      title="Edit Exercise"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ex.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Exercise Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingExercise ? 'Edit Exercise Movement' : 'Register New Exercise Movement'}
        subtitle="Define biomechanical criteria and training volume defaults."
      >
        <form onSubmit={handleCreateOrUpdate} className="space-y-4 text-xs font-sans">
          <Input
            label="Movement Title"
            placeholder="e.g. Bulgarian Split Squat"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Movement Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="Legs / Lower Body">Legs / Lower Body</option>
                <option value="Chest / Upper Body">Chest / Upper Body</option>
                <option value="Posterior Chain / Back">Posterior Chain / Back</option>
                <option value="Core / Stabilization">Core / Stabilization</option>
                <option value="Arms / Shoulders">Arms / Shoulders</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Sets"
              type="number"
              value={formData.defaultSets}
              onChange={(e) => setFormData({ ...formData, defaultSets: e.target.value })}
            />
            <Input
              label="Reps"
              type="number"
              value={formData.defaultReps}
              onChange={(e) => setFormData({ ...formData, defaultReps: e.target.value })}
            />
            <Input
              label="Rest (Secs)"
              type="number"
              value={formData.restSeconds}
              onChange={(e) => setFormData({ ...formData, restSeconds: e.target.value })}
            />
          </div>

          <Input
            label="Equipment Requirements"
            placeholder="e.g. Dumbbells or Kettlebells"
            value={formData.equipment}
            onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
          />

          <Input
            label="Biomechanical Form Cues (Comma separated)"
            placeholder="e.g. Flare knees out, Keep chin tucked, Squeeze glutes at top"
            value={formData.formCues}
            onChange={(e) => setFormData({ ...formData, formCues: e.target.value })}
          />

          <div className="flex gap-3 pt-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cyber"
              className="flex-1"
            >
              {editingExercise ? 'Save Updates' : 'Publish Movement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

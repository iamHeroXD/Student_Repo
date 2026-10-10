"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, Calendar, BookOpen, Clock } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "1", title: "Revise Molecular Basis of Inheritance transcription diagram", subject: "Biology", dueDate: "2026-10-15", completed: false },
    { id: "2", title: "Solve Plus Two Physics March 2025 question paper section B", subject: "Physics", dueDate: "2026-10-18", completed: true },
    { id: "3", title: "Review qualitative salt analysis anions chart", subject: "Chemistry", dueDate: "2026-10-20", completed: false },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Biology");
  const [newDueDate, setNewDueDate] = useState("2026-10-25");

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: newDueDate,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTitle("");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F8FAFC]">
          Personal Study Planner
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
          Plan chapter revisions, track countdowns, and stay consistent throughout your academic term.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Add Task */}
        <div className="md:col-span-1 space-y-6">
          <form onSubmit={addTask} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-4 dark:border-[#1E2922] dark:bg-[#0F1310] shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
              New Study Task
            </h3>

            <div>
              <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Task Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Practice Circles 4-mark questions"
                required
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Subject</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              >
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Accountancy">Accountancy</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Target Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#10B981] py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] active:scale-98 transition"
            >
              Add Task
            </button>
          </form>

          {/* Quick Exam Countdown widget */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 dark:border-emerald-950 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-[#10B981] font-semibold text-xs mb-2">
              <Clock className="h-4 w-4" /> Board Exam Countdown
            </div>
            <div className="text-2xl font-black text-[#090A0B] dark:text-[#F8FAFC]">
              142 Days
            </div>
            <p className="text-2xs text-[#64748B] dark:text-[#94A3B8] mt-1">
              Estimated days remaining until Higher Secondary Board Examinations (March session).
            </p>
          </div>
        </div>

        {/* Right Column: Task List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
            <span>{tasks.filter(t => !t.completed).length} pending • {tasks.filter(t => t.completed).length} completed</span>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between rounded-2xl border p-4 transition duration-150 ${
                  task.completed 
                    ? "border-[#E2E8F0] bg-stone-50/70 opacity-60 dark:border-[#1E2922] dark:bg-[#0A0D0B]" 
                    : "border-[#E2E8F0] bg-white shadow-2xs hover:border-[#10B981]/50 dark:border-[#1E2922] dark:bg-[#0F1310]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
                    className="text-[#94A3B8] hover:text-[#10B981] transition active:scale-90"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-xs font-semibold ${task.completed ? "line-through text-[#94A3B8]" : "text-[#090A0B] dark:text-[#F8FAFC]"}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 text-2xs text-[#94A3B8] mt-1">
                      <span className="font-medium text-[#10B981]">{task.subject}</span>
                      <span>•</span>
                      <span>Due {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="text-[#94A3B8] hover:text-rose-600 p-1.5 transition active:scale-90"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

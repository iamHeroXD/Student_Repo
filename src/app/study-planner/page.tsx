"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Trash2, Clock, CalendarPlus } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

const STORAGE_KEY = "sr_study_tasks_v1";
const EXAM_DATE_KEY = "sr_exam_target_date_v1";

export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Biology");
  const [newDueDate, setNewDueDate] = useState("");
  const [examDate, setExamDate] = useState("2027-03-01");

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      const savedExamDate = localStorage.getItem(EXAM_DATE_KEY);
      if (savedExamDate) {
        setExamDate(savedExamDate);
      }
      const today = new Date().toISOString().split("T")[0];
      setNewDueDate(today);
    } catch {
      // ignore storage errors
    }
    setMounted(true);
  }, []);

  const persistTasks = (updated: TaskItem[]) => {
    setTasks(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleTask = (id: string) => {
    persistTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    persistTasks(tasks.filter((t) => t.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: newDueDate || new Date().toISOString().split("T")[0],
      completed: false,
    };
    persistTasks([newTask, ...tasks]);
    setNewTitle("");
  };

  const handleExamDateChange = (val: string) => {
    setExamDate(val);
    try {
      localStorage.setItem(EXAM_DATE_KEY, val);
    } catch {
      // ignore
    }
  };

  const daysUntilExam = Math.max(
    0,
    Math.ceil(
      (new Date(examDate).getTime() - new Date().setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight">
          Personal Study Planner
        </h1>
        <p className="text-xs sm:text-sm text-[#5C574F] dark:text-[#94A3B8] mt-1">
          Plan chapter revisions, track your exam countdown, and save tasks directly in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Add Task + Exam Countdown */}
        <div className="md:col-span-1 space-y-6">
          <form
            onSubmit={addTask}
            className="rounded-2xl border border-[#D8CEBE] bg-white p-5 space-y-4 dark:border-[#1E2922] dark:bg-[#0F1310] shadow-2xs"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
              Add Study Task
            </h3>

            <div>
              <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Task Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Revise Electrostatics derivations"
                required
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Subject
              </label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              >
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Accountancy">Accountancy</option>
                <option value="Business Studies">Business Studies</option>
                <option value="Economics">Economics</option>
                <option value="English">English</option>
                <option value="Social Science">Social Science</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Target Date
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#2FB617] py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#259212] active:scale-98 transition"
            >
              Save Study Task
            </button>
          </form>

          {/* Customizable Exam Countdown Widget */}
          <div className="rounded-2xl border border-[#2FB617]/25 bg-[#2FB617]/5 p-5 dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="flex items-center justify-between text-[#2FB617] font-semibold text-xs mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Exam Countdown
              </span>
            </div>
            <div className="text-2xl font-black text-[#090A0B] dark:text-[#F8FAFC]">
              {mounted ? `${daysUntilExam} Days` : "—"}
            </div>
            <div className="mt-3">
              <label className="block text-2xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                Target Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => handleExamDateChange(e.target.value)}
                className="w-full rounded-lg border border-[#D8CEBE] bg-white px-2.5 py-1.5 text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Task List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
            <span>
              {tasks.filter((t) => !t.completed).length} pending •{" "}
              {tasks.filter((t) => t.completed).length} completed
            </span>
            {tasks.some((t) => t.completed) && (
              <button
                onClick={() => persistTasks(tasks.filter((t) => !t.completed))}
                className="text-2xs font-semibold text-rose-500 hover:underline"
              >
                Clear Completed
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D8CEBE] bg-white p-12 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
              <CalendarPlus className="h-9 w-9 text-[#2FB617] mx-auto mb-2.5" />
              <h4 className="text-sm font-bold text-[#090A0B] dark:text-[#F8FAFC]">
                Your Study Planner is Empty
              </h4>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-sm mx-auto">
                Add your first chapter revision goal or question paper practice task using the form on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition duration-150 ${
                    task.completed
                      ? "border-[#D8CEBE] bg-[#E8DFCE] opacity-60 dark:border-[#1E2922] dark:bg-[#0A0D0B]"
                      : "border-[#D8CEBE] bg-white shadow-2xs hover:border-[#2FB617]/50 dark:border-[#1E2922] dark:bg-[#0F1310]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      aria-label={
                        task.completed ? "Mark task incomplete" : "Mark task complete"
                      }
                      className="text-[#94A3B8] hover:text-[#2FB617] transition active:scale-90"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-[#2FB617]" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>

                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          task.completed
                            ? "line-through text-[#94A3B8]"
                            : "text-[#090A0B] dark:text-[#F8FAFC]"
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-2xs text-[#94A3B8] mt-1">
                        <span className="font-medium text-[#2FB617]">
                          {task.subject}
                        </span>
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
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
export default function Home() {
  const [courses, setCourses] = useState<
  {
    id: number;
    name: string;
    code: string;
  }[]
>([]);

const [studySessions, setStudySessions] = useState<
  {
    id: number;
    courseId: number;
    date: string;
    startTime: string;
    endTime: string;
    completed: boolean;
  }[]
>([]);
const [assignments, setAssignments] = useState<
{
  id: number;
  courseId: number;
  title: string;
  marks: number;
  dueDate: string;
  estimatedTime: string;
  priority: "Low" | "Medium" | "High";
}[]
>([]);
const [exams, setExams] = useState<
  {
    id: number;
    courseId: number;
    title: string;
    venue: string;
    startTime: string;
    endTime: string;
    date: string;
  }[]
>([]);


useEffect(() => {
  const savedCourses = localStorage.getItem("courses");

  if (savedCourses) {
    setCourses(JSON.parse(savedCourses));
  }

  const savedStudySessions = localStorage.getItem("studySessions");

  if (savedStudySessions) {
    setStudySessions(JSON.parse(savedStudySessions));
  }
  const savedAssignments = localStorage.getItem("assignments");

if (savedAssignments) {
  setAssignments(JSON.parse(savedAssignments));
}
const savedExams=localStorage.getItem("exams");
if(savedExams){
  setExams(JSON.parse(savedExams));
}
}, []);
const completedSessions = studySessions.filter(
  (session) => session.completed
);
const today=new Date();
today.setHours(0,0,0,0);
const upcomingExams=exams.filter((exam)=>{
  const examDate=new Date(exam.date + "T00:00:00");
  return examDate>=today;
});
const nextExam=upcomingExams.sort(
  (a,b)=>
    new Date(a.date).getTime()-
  new Date(b.date).getTime()
)[0];
const totalAssignments = assignments.length;

const highPriorityAssignments = assignments.filter(
  (assignment) => assignment.priority === "High"
).length;
 const today2=new Date();
   today2.setHours(0,0,0,0);
   const startOfWeek=new Date(today2);
   const day=today2.getDay();
   const daysFromMonday=day===0 ? 6:day-1;
   startOfWeek.setDate(today2.getDate()-daysFromMonday);
   const endOfWeek=new Date(startOfWeek);
   endOfWeek.setDate(startOfWeek.getDate()+6);
   endOfWeek.setHours(23,59,59,999);
   const dueThisWeek=assignments.filter((assignment)=>{
    const dueDate=new Date(assignment.dueDate + "T00:00:00");
    return dueDate>=startOfWeek && dueDate<=endOfWeek;
   }).length;
  return (
    
    <main className="min-h-screen p-4 md:p-8">
     <Navbar/>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
  Dashboard
</h1>

<p className="text-gray-500 mb-6">
  Here's an overview of your studies.
</p>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
  href="/courses"
  className="block border border-gray-200 bg-white p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
>
  <h3 className="font-semibold text-lg">📚 Courses</h3>

<p className="text-2xl font-bold mt-2">
  {courses.length}
</p>

<p className="text-gray-500">
  Total Courses
</p>
</Link>
      <Link
  href="/assignments"
  className="block border border-gray-200 bg-white p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
>
<h3 className="font-semibold text-lg">📝 Assignments</h3>

<p className="text-2xl font-bold mt-2">
  {totalAssignments}
</p>

<p className="text-gray-500">
  Total Assignments
</p>

<div className="mt-3 space-y-1">
  <p className="text-red-500 font-medium">
    🔥 {highPriorityAssignments} High Priority
  </p>

  <p className="text-blue-500 font-medium">
    📅 {dueThisWeek} Due This Week
  </p>
</div>
</Link>
        <Link
  href="/StudyPlanner"
  className="block border border-gray-200 bg-white p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
>
<h3 className="font-semibold text-lg">✅ Completed Study Sessions</h3>

<p className="text-2xl font-bold mt-2">
  {completedSessions.length}
</p>

<p className="text-gray-500">
  Completed Study Sessions
</p>
</Link>
        <Link
  href="/StudyPlanner"
  className="block border border-gray-200 bg-white p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
>
 <h3 className="font-semibold text-lg">📖 Study Sessions</h3>

<p className="text-2xl font-bold mt-2">
  {studySessions.length}
</p>

<p className="text-gray-500">
  Total Study Sessions
</p>
</Link>  <Link
  href="/exams"
className="block border border-gray-200 bg-white p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
>
  <h3 className="font-semibold text-lg">
    📅 Upcoming Exams
  </h3>

 
  <p className="text-2xl font-bold mt-2">{upcomingExams.length}
    </p>   


  <p className="text-gray-500">
    Upcoming Exams
  </p>

  {nextExam && (
   <div className="mt-4 border-t pt-3">
  <p className="text-sm font-medium text-gray-500 mb-1">
    Next Exam
  </p>

  <p className="font-semibold text-lg">
    {nextExam.title}
  </p>
      <p>
        📅 {new Date(nextExam.date).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric"
          }
        )}
      </p>

<p>⏰ {nextExam.startTime} - {nextExam.endTime}</p>
      <p>📍 {nextExam.venue}</p>
    </div>
  )}
</Link>      </div>
      <Link
  href="/courses"
  className="inline-block mt-6 px-4 py-2 bg-black text-white rounded-lg"
>
  Add Course
</Link>
    </main>
  );
}
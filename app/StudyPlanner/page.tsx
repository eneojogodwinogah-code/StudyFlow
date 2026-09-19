"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
export default function StudyPlannerPage() {
    const [courses, setCourses] = useState<
  {
    id: number;
    name: string;
    code: string;
  }[]
>([]);

const [selectedCourseId, setSelectedCourseId] = useState("");

const [date, setDate] = useState("");

const [startTime, setStartTime] = useState("");

const [endTime, setEndTime] = useState("");
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
const [isLoaded,setIsloaded]=useState(false);
const [editingId,setEditingId]= useState<number | null>(null);
const [errors,setErrors]=useState({
  course:"",
  date:"",
startTime:"",
endTime:"",
})
useEffect(()=>{
  const savedCourse=localStorage.getItem("courses")
  if(savedCourse){
    setCourses(JSON.parse(savedCourse))
  }
},[] )
useEffect(() => {
  const savedStudySessions =
    localStorage.getItem("studySessions");

  if (savedStudySessions) {
    setStudySessions(JSON.parse(savedStudySessions));
  }
  setIsloaded(true);
}, []);
useEffect(() => {
  if(!isLoaded){
    return;
  }
  localStorage.setItem(
    "studySessions",
    JSON.stringify(studySessions)
  );
}, [studySessions,isLoaded]);
function completeStudySession(id: number) {
  const updatedStudySessions = studySessions.map((session) => {
    if (session.id === id) {
      return {
        ...session,
        completed: !session.completed,
      };
    }

    return session;
  });

  setStudySessions(updatedStudySessions);
}
function deleteStudySessions(id:number){
  const updatedStudySessions=studySessions.filter((session)=>
  session.id!==id
  );
  setStudySessions(updatedStudySessions);
}
function editStudySession(session: typeof studySessions[number]){
setEditingId(session.id);
setSelectedCourseId(String(session.courseId));
setDate(session.date);
setStartTime(session.startTime);
setEndTime(session.endTime);
}
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const newErrors={
    course:"",
    date:"",
    startTime:"",
    endTime:"",
  }
  if(selectedCourseId===""){
    newErrors.course="Please select a course"
  }
  if(date===""){
    newErrors.date="Please select a date";
  }
  if(startTime===""){
    newErrors.startTime="Please select a start time";
  }
  if(endTime===""){
    newErrors.endTime="Please select an end time";
  }
  if(startTime!=="" && endTime!=="" && endTime<=startTime){
    newErrors.endTime="End Time is supposed to be after start time";
  }
  if(newErrors.course || newErrors.date || newErrors.startTime || newErrors.endTime){
    setErrors(newErrors);
    return;
  }
  
  if(editingId!==null){
    const updatedStudySessions=studySessions.map((session)=>{
      if(session.id===editingId){
        return{
          ...session,
          courseId:Number(selectedCourseId),
          date,
          startTime,
          endTime
        }
      }
      return session;
    })
    setStudySessions(updatedStudySessions);
    setEditingId(null);
  }
else{
  const newSession = {
    id: Date.now(),
    courseId: Number(selectedCourseId),
    date,
    startTime,
    endTime,
    completed: false,
  };

setStudySessions([...studySessions, newSession]);
setSelectedCourseId("");
  setDate("");
  setStartTime("");
  setEndTime("");
}
}


  return (
    <main className="min-h-screen p-4 md:p-8">
      <Navbar/>
      <form onSubmit={handleSubmit} className="space-y-4">
 <h1 className="text-4xl font-bold mb-6">
        Study Planner
      </h1>
 {studySessions.length===0 ? (
  <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center max-w-xl">
  <p className="text-lg font-semibold text-gray-700">
    No Study Session yet
  </p>

  <p className="mt-2 text-sm text-gray-500">
    Add your first study session.
  </p>
</div>
 ):(
 studySessions.map((session) => {
  const course = courses.find(
    (course) => course.id === session.courseId
  );

  return (
    <div key={session.id} className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <p>Course: {course?.name}</p>
      <p>Date: {new Date (session.date).toLocaleDateString("en-US",{
        month:"short",
        day:"numeric",
        year:"numeric"
      })}</p>
      <p>Start Time: {session.startTime}</p>
      <p>End Time: {session.endTime}</p>
      <p>
        Status: {session.completed ? "Completed" : "Not Completed"}
      </p>
        <button
        type="button"
        onClick={() => completeStudySession(session.id)}
        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
      >
      {session.completed ? "Mark as Incomplete" : "Mark as Complete"}
      </button>
      <button
      type="button"
      onClick={()=> deleteStudySessions(session.id)}
       className="mt-2 ml-2 px-3 py-1 bg-red-600 text-white rounded"
      >Delete</button>
      <button
      type="button"
  onClick={() => editStudySession(session)}
  className="mt-2 ml-2 px-3 py-1 bg-blue-600 text-white rounded"
>
  Edit
</button>
    </div>
  );
})
)}
<div className="space-y-4 max-w-xl border border-gray-200 bg-white rounded-xl p-6 shadow-sm">
<label className="block font-semibold">
  Course
</label>
  <select
    value={selectedCourseId}
    onChange={(e) =>{ setSelectedCourseId(e.target.value)
      setErrors({
        ...errors,
        course:""
      })
    }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    <option value="">Select a Course</option>

    {courses.map((course) => (
      <option key={course.id} value={course.id}>
        {course.name}
      </option>
    ))}
  </select>
  {errors.course &&(
    <p className="text-red-500 text-sm">
      {errors.course}
    </p>
  ) }
<label className="block font-semibold">
  Study Date
</label>
  <input
    type="date"
    value={date}
    onChange={(e) =>{ setDate(e.target.value)
      setErrors({
        ...errors,
        date:""
      })
    }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />
{errors.date &&(
  <p className="text-red-500 text-sm">
    {errors.date}
  </p>
)}
<label className="block font-semibold">
  Start Time
</label>
  <input
    type="time"
    value={startTime}
    onChange={(e) => {setStartTime(e.target.value)
      setErrors({
        ...errors,
        startTime:""
      })
    }}
       className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />
  {errors.startTime &&(
    <p className="text-red-500 text-sm">
      {errors.startTime}
    </p>
  )}
<label className="block font-semibold">
  End Time
</label>
  <input
    type="time"
    value={endTime}
    onChange={(e) => {setEndTime(e.target.value)
      setErrors({
        ...errors,
        endTime:""
      })
    }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />
  {errors.endTime &&(
    <p className="text-red-500 text-sm">
      {errors.endTime}
    </p>
  )}

  <button
    type="submit"
    className="px-4 py-2 bg-black text-white rounded-lg"
  >
  {editingId !== null ? "Update Session" : "Save Session"}
  </button>
</div>
</form>
    </main>
  );
} 
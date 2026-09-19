"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function CoursesPage() {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
const [courses, setCourses] = useState<
  {
    id: number;
    name: string;
    code: string;
  }[]
>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingId,setEditingId]=useState<number |null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));     
    }
     setIsLoaded(true);
  }, []);

  useEffect(() => {
  if (!isLoaded) return;

  localStorage.setItem("courses", JSON.stringify(courses));
}, [courses, isLoaded]);


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseName.trim() || !courseCode.trim()) {
  setError("Please enter both the course name and course code.");
  return;
}

setError("");
    if(editingId!==null){
      const updatedCourses=courses.map((course)=>{
        if(course.id===editingId){
          return{
            ...course,
            name:courseName,
            code:courseCode
          }
        }
        return course;
      })
      setCourses(updatedCourses);
      setEditingId(null);
    }
    else{
    const newCourse = {
  id: Date.now(),
  name: courseName,
  code: courseCode,
};

    setCourses([...courses, newCourse]);
    }
    setCourseName("");
    setCourseCode("");

  }
  function deleteCourse(idToDelete: number) {
  const updatedCourses = courses.filter(
    (course) => course.id !== idToDelete
  );

  setCourses(updatedCourses);
}
function editCourse(id:number){
  const courseToEdit=courses.find((course)=>
  course.id===id);
  if(!courseToEdit) return;
  setCourseName(courseToEdit.name);
  setCourseCode(courseToEdit.code);
  setEditingId(courseToEdit.id);
}

  return (
    <main className="min-h-screen p-4 md:p-8">
      <Navbar/>
      <h1 className="text-4xl font-bold mb-6">Courses</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
{error && (
  <p className="text-sm text-red-600">
    {error}
  </p>
)}
        <input
          type="text"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

       <button
  type="submit"
  className="px-4 py-2 bg-black text-white rounded-lg"
>
  {editingId !== null ? "Update Course" : "Add Course"}
</button>
      </form>

      <div className="mt-8 space-y-2">
  {courses.length === 0 ? (
    <p>No courses yet.</p>
  ) : (
    courses.map((course) => (
      <div key={course.id} className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
        <h2 className="font-semibold">{course.name}</h2>
        <p>{course.code}</p>

      <div className="flex gap-2 mt-2">
  <button
    type="button"
    onClick={() => editCourse(course.id)}
      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => deleteCourse(course.id)}
    className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
  >
    Delete
  </button>
</div>
      </div>
    ))
  )}
</div>
    </main>
  );
}
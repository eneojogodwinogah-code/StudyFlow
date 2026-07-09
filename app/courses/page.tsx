"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CoursesPage() {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState<
    { name: string; code: string }[]
  >([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
       
  setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
  if (!isLoaded) return;

  localStorage.setItem("courses", JSON.stringify(courses));
}, [courses, isLoaded]);


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newCourse = {
      name: courseName,
      code: courseCode,
    };

    setCourses([...courses, newCourse]);

    setCourseName("");
    setCourseCode("");
  }
  function deleteCourse(indexToDelete: number) {
  const updatedCourses = courses.filter(
    (_, index) => index !== indexToDelete
  );

  setCourses(updatedCourses);
}

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Courses</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Add Course
        </button>
      </form>

      <div className="mt-8 space-y-2">
  {courses.length === 0 ? (
    <p>No courses yet.</p>
  ) : (
    courses.map((course, index) => (
      <div key={index} className="border p-4 rounded-lg">
        <h2 className="font-semibold">{course.name}</h2>
        <p>{course.code}</p>

        <button
          onClick={() => deleteCourse(index)}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    ))
  )}
</div>
    </main>
  );
}
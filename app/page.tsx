import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    
    <main className="min-h-screen p-8">
      <nav className="mb-8 flex gap-4">
  <Link href="/" className="text-blue-600 hover:underline">
    Dashboard
  </Link>

  <Link href="/courses" className="text-blue-600 hover:underline">
    Courses
  </Link>

  <Link href="/StudyPlanner" className="text-blue-600 hover:underline">
    Study Planner
  </Link>
</nav>

      <h1 className="text-4xl font-bold mb-6">StudyFlow</h1>

      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="space-y-4">
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Courses</h3>
          <p>0 Courses</p>
        </div>

        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Assignments</h3>
          <p>0 Assignments</p>
        </div>

        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Upcoming Exams</h3>
          <p>0 Exams</p>
        </div>
      </div>

      <button className="mt-6 px-4 py-2 bg-black text-white rounded-lg">
        Add Course
      </button>
    </main>
  );
}

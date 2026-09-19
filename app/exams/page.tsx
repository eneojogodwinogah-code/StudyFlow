"use client"
import {useState,useEffect} from "react"
import Navbar from "@/components/Navbar";
export default function ExamsPage() {
  const [exams,setExams]=useState<
  {
id:number;
courseId:number;
title:string;
startTime:string;
endTime:string;
date:string;
venue:string;

  }[]>([])
  const [selectedCourseId,setSelectedCourseId]=useState("");
  const  [title,setTitle]=useState("");
  const [startTime,setStartTime]=useState("");
  const [endTime,setEndTime]= useState("");
  const [date,setDate]=useState("");
  const [venue,setVenue]=useState("");
  const [courses,setCourses]= useState<
  {
    id:number;
    name:string;
    code:string;
  }[]>([])
  const [errors,setErrors]=useState({
    course:"",
    title:"",
    startTime:"",
    endTime:"",
    venue:"",
    date:""
  })
  const [editingId,setEditingId]=useState<number| null>(null);
const [isExamsLoaded, setIsExamsLoaded] = useState(false);
useEffect(()=>{
  const savedCourses=localStorage.getItem("courses");
  if(savedCourses){
    setCourses(JSON.parse(savedCourses))
  }
  const savedExams=localStorage.getItem("exams");
  if(savedExams){
    setExams(JSON.parse(savedExams));
  }
  setIsExamsLoaded(true);
},[]);
  useEffect(()=>{
    if(!isExamsLoaded){
      return;
    }
    localStorage.setItem("exams",JSON.stringify(exams))
  },[exams,isExamsLoaded])
  function handleSubmit(e:React.FormEvent){
e.preventDefault();
const newErrors={
  course:"",
  title:"",
  venue:"",
  date:"",
  startTime:"",
  endTime:"",
}
if(selectedCourseId===""){
  newErrors.course="Please select a course";
}
if(title.trim()===""){
 newErrors.title="The title field is required";
}
if(venue.trim()===""){
  newErrors.venue="The venue field is required";
}
if(date===""){
  newErrors.date="The date field is required";
}
if(startTime===""){
  newErrors.startTime="The start time is required";
}

if(endTime===""){
  newErrors.endTime="The end time is required";
}
if (startTime && endTime) {
  const timeToMinutes = (time: string) => {
    const [hour, period] = time.split(/(?=am|pm)/);

    let hours = Number(hour);

    if (period === "pm" && hours !== 12) {
      hours += 12;
    }

    if (period === "am" && hours === 12) {
      hours = 0;
    }

    return hours * 60;
  };

  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    newErrors.endTime = "End time must be after start time";
  }
  else{
    newErrors.endTime="";
  }
}

if(newErrors.title||
newErrors.course||
newErrors.date||
newErrors.startTime||
newErrors.endTime ||
newErrors.venue
) {
  setErrors(newErrors);
  return;
}
const newExam={
  id:Date.now(),
  courseId:Number(selectedCourseId),
  title,
  date,
  startTime,
  endTime,
  venue
}
if(editingId===null){
setExams([...exams,newExam]);
}
else{
  const updatedExams=exams.map((exam)=>{
  if(exam.id===editingId){
   return{
    ...exam,
    courseId:Number(selectedCourseId),
    title,
    venue,
    startTime,
    endTime,
    date,
   }
  }
return exam;
})
setExams(updatedExams);
setEditingId(null);
}
setSelectedCourseId("");
setDate("");
setStartTime("");
setEndTime("");
setTitle("");
setVenue("");
  }
  function deleteExam(id:number){
    const updatedExam=exams.filter((exam)=>
    exam.id!==id
    );
    setExams(updatedExam)
  }
  function editExam(id:number){
    const exam=exams.find((exam)=>  
    exam.id===id
  );
  if(exam){
    setEditingId(exam.id);
    setSelectedCourseId(String(exam.courseId));
    setStartTime(exam.startTime);
    setEndTime(exam.endTime);
    setVenue(exam.venue);
    setTitle(exam.title);
    setDate(exam.date);
  }
  }
  return (
<main className="min-h-screen p-4 md:p-8">
  <Navbar/>
  <div>
    <h2 className="text-2xl font-bold mb-4">
  {editingId === null ? "Add Exam" : "Edit Exam"}
</h2>
<form
  onSubmit={handleSubmit}
  className="space-y-4 max-w-xl border border-gray-200 bg-white rounded-xl p-6 shadow-sm"
>
  
           <label className="block text-sm font-medium text-gray-700 mb-1.5">
  Course
</label>
        <select value={selectedCourseId}
        onChange={(e)=>{ setSelectedCourseId(e.target.value);
          setErrors({
            ...errors,
            course:""
          })
        }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Select a Course</option>
          {courses.map((course)=>(
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
))}
        </select>
        {errors.course &&(
          <p className="text-red-500 text-sm">{errors.course}</p>
        )}
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
  Exam Title
</label>
        <input type="text"
        placeholder="Enter exam title"
        value={title}
        onChange={(e)=>{ setTitle(e.target.value);
          setErrors({
            ...errors,
            title:""
          })
        } }
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
      {errors.title &&(
        <p className="text-red-500 text-sm">{errors.title}</p>
      )}
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
  Exam Date
</label>
      <input type="date"
      value={date}
      onChange={(e)=>{ setDate(e.target.value);
        setErrors({
          ...errors,
          date:""
        })
      } }
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
      {errors.date &&(
        <p className="text-red-500 text-sm">{errors.date}</p>
      )}
             <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
<select
  value={startTime}
  onChange={(e) => {
    setStartTime(e.target.value);
    setErrors({ ...errors, startTime: "" });
  }}
 className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
>
  <option value="">Select Start Time</option>
  <option value="8am">8:00am</option>
  <option value="10am">10:00am</option>
  <option value="12pm">12:00pm</option>
  <option value="2pm">2:00pm</option>
</select>

{errors.startTime && (
  <p className="text-red-500 text-sm">{errors.startTime}</p>
)}


<label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
<select
  value={endTime}
  onChange={(e) => {
    setEndTime(e.target.value);
    setErrors({ ...errors, endTime: "" });
  }}
  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
>
  <option value="">Select End Time</option>
  <option value="10am">10:00am</option>
  <option value="12pm">12:00pm</option>
  <option value="2pm">2:00pm</option>
  <option value="4pm">4:00pm</option>
</select>

{errors.endTime && (
  <p className="text-red-500 text-sm">{errors.endTime}</p>
)}
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
  Exam Venue
</label>
      <input type="text"
      value={venue}
      onChange={(e)=> {setVenue(e.target.value);
        setErrors({
          ...errors,
          venue:""
        })
      }}
      placeholder="Enter Venue"
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {errors.venue &&(
        <p className="text-red-500 text-sm">{errors.venue}</p>
      )}
      <button type="submit"
      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
>{editingId === null ? "Save Exam" : "Update Exam"}</button>
      </form>
      {exams.length === 0 ? (
 <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center max-w-xl">
  <p className="text-lg font-semibold text-gray-700">
    No exams yet
  </p>

  <p className="mt-2 text-sm text-gray-500">
    Add your upcoming exams to keep track of your schedule.
  </p>
</div>
) : (
  <div className="mt-6 space-y-4 max-w-xl">
    {exams.map((exam) => {
      const course = courses.find(
        (course) => course.id === exam.courseId
      );
       const formattedDate=new Date(exam.date).toLocaleDateString("en-US",{
        month:"short",
        day:"numeric",
        year:"numeric"
       })
      return (
      <div
  key={exam.id}
  className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
>
<div className="mt-2 text-sm text-gray-600">
  <p>📚 Course: {course?.name}</p>
</div>
<p className="text-sm font-medium text-gray-600 mt-1 ">
  Exam Name
</p>
<p className="text-xl font-semibold mt-0.3">
  {exam.title}
</p>
<div className="mt-4 space-y-2 text-sm text-gray-600">
  <p>📅 Date: {formattedDate}</p>
  <p>⏰ Time: {exam.startTime} - {exam.endTime}</p>
  <p>📍 Venue: {exam.venue}</p>
</div><div className="flex gap-3 border-t border-gray-200 pt-4 mt-4">
 <button
  onClick={() => editExam(exam.id)}
  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
>
  Edit
</button>

  <button
  onClick={() => deleteExam(exam.id)}
  className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
>
  Delete
</button>
</div>
        </div>
      );
    })}
  </div>
)}
      
      </div>
      </main>
  )
}

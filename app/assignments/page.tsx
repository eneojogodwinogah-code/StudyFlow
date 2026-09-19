"use client";
import {useState, useEffect} from "react"
import Navbar from "@/components/Navbar";
export default function AssignmentsPage(){
const [assignments,setAssignments] =useState<
{
id:number;
courseId:number;
title:string;
marks:number;
dueDate:string;
estimatedTime:string;
priority:"Low" |"Medium" | "High";
}[]>
([]);
const [selectedCourseId,setselectedCourseId]=useState("");
const [title,setTitle]=useState("");
const [dueDate,setDueDate]=useState("");
const [marks,setMarks]=useState(0);
const [estimatedTime,setEstimatedTime]=useState("");
const [editingId,setEditingId]=useState<number|null>(null);
const[errors,setErrors]=useState({
    course:"",
    title:"",
    dueDate:"",
     marks:"",
    estimatedTime:"",
    priority:""
})
const [priority, setPriority] = useState<
  "" | "Low" | "Medium" | "High"
>("");
const [courses,setCourses]=useState<
{
    id:number;
    name:string;
    code:string;
} []>([])

const [isLoaded,setIsLoaded]=useState(false);
useEffect(()=>{
    const savedAssignment=localStorage.getItem("assignments");
    if(savedAssignment){
        setAssignments(JSON.parse(savedAssignment));
    }
    setIsLoaded(true);
},
[]);
useEffect(()=>{
    if(!isLoaded){
        return;
    }
   localStorage.setItem("assignments",JSON.stringify(assignments))
},[assignments,isLoaded])

useEffect(()=>{
    const savedCourse=localStorage.getItem("courses");
    if(savedCourse){
        setCourses(JSON.parse(savedCourse));
    }
},[] )
function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    const newErrors = {
    course: "",
    title: "",
    dueDate: "",
    marks:"",
    estimatedTime:"",
    priority: ""
};
if (selectedCourseId === "") {
    newErrors.course = "Please select a course";
}
if (title.trim() === "") {
     newErrors.title="Title is required";
}
if(dueDate===""){
    newErrors.dueDate="Due Date is required";
}
if(marks <= 0){
    newErrors.marks="Marks must be greater than 0";
}
if(estimatedTime===""){
 newErrors.estimatedTime="Estimated time is required";   
}
if(priority===""){
    newErrors.priority="Please select a priority";
}
if (
    newErrors.course ||
    newErrors.title ||
    newErrors.dueDate ||
     newErrors.marks||
      newErrors.estimatedTime||
    newErrors.priority
) {
    setErrors(newErrors);
    return;
}
  
const newAssignment={
    id: editingId ?? Date.now(),
    courseId:Number(selectedCourseId),
    title,
    dueDate,
    marks,
    priority:priority as "Low"|"Medium"|"High",
    estimatedTime
}
if(editingId===null){
    setAssignments([...assignments,newAssignment])
}
else{
    const updatedAssignments=assignments.map((assignment)=>{
        if(assignment.id===editingId){
            return{
                ...assignment,
                courseId:Number(selectedCourseId),
                title,
                dueDate,
                priority:priority as "Low"|"Medium"|"High",
                marks,
                estimatedTime,
            }
        }
        return assignment;
    })
    setAssignments(updatedAssignments);
    setEditingId(null);
}
setselectedCourseId("");
setTitle("");
setDueDate("");
setPriority("");
setMarks(0);
setEstimatedTime("");
   setErrors({
    course: "",
    title: "",
    dueDate: "",
     marks:"",
    estimatedTime:"",
    priority: ""
});
}
 
function deleteAssignment(id:number){
    const updatedAssignments=assignments.filter((assignment)=>
    assignment.id!==id
)
setAssignments(updatedAssignments);
}
function editAssignment(id:number){
    const assignment=assignments.find((assignment)=>
    assignment.id===id
    );
    if(assignment){
        setEditingId(assignment.id);
        setTitle(assignment.title);
        setDueDate(assignment.dueDate);
        setMarks(assignment.marks);
        setEstimatedTime(assignment.estimatedTime);
        setPriority(assignment.priority);
        setselectedCourseId(String(assignment.courseId))
    }
}
const totalAssignment=assignments.length;
const highPriorityAssignments=assignments.filter(
    (assignment)=>  assignment.priority==="High"
    ).length;
    const today=new Date();
   today.setHours(0,0,0,0);
   const startOfWeek=new Date(today);
   const day=today.getDay();
   const daysFromMonday=day===0 ? 6:day-1;
   startOfWeek.setDate(today.getDate()-daysFromMonday);
   const endOfWeek=new Date(startOfWeek);
   endOfWeek.setDate(startOfWeek.getDate()+6);
   endOfWeek.setHours(23,59,59,999);
   const dueThisWeek=assignments.filter((assignment)=>{
    const dueDate=new Date(assignment.dueDate + "T00:00:00");
    return dueDate>=startOfWeek && dueDate<=endOfWeek;
   }).length;
    const priorityColors = {
    Low: "bg-green-500",
    Medium: "bg-yellow-500",
    High: "bg-red-500",
};
return(
<main className="min-h-screen p-4 md:p-8">
    <Navbar/>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div  className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
        <h3 className="text-gray-500">📝 Total Assignments</h3>
        <p className="text-2xl font-bold">
            {totalAssignment}
        </p>
    </div>

    <div   className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
        <h3 className="text-gray-500">🔥 High Priority</h3>
        <p className="text-2xl font-bold">
            {highPriorityAssignments}
        </p>
    </div>

    <div   className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
        <h3 className="text-gray-500">📅 Due This Week</h3>
     <p className="text-2xl font-bold">
    {dueThisWeek}
</p>
    </div>
</div>
  <form onSubmit={handleSubmit} className="space-y-4 max-w-xl border border-gray-200 bg-white rounded-xl p-6 shadow-sm">
    <label className="block font-semibold">Course</label>
    <select value={selectedCourseId}
onChange={(e)=>{ setselectedCourseId(e.target.value)
    setErrors({
        ...errors,
        course:""
    })
}
}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
>
    <option value="">Select a Course</option>
    {courses.map((course)=>(
 <option key={course.id} value={course.id}>
    {course.name}
 </option>
    ))}
</select>
{errors.course && (
    <p className="text-red-500 text-sm">
        {errors.course}
    </p>
)}
<label className="block font-semibold">
  Assignment Title
</label>
    <input type="text"
    placeholder="Enter assignment title"
    value={title}
    onChange={(e)=> {setTitle(e.target.value);
        setErrors({
            ...errors,
            title:""
        });
    }
    }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

{errors.title && (
    <p className="text-red-500 text-sm">
        {errors.title}
    </p>
)}
<label className="block font-semibold">
  Due Date
</label>
    < input type="date"
    value={dueDate}
    onChange={(e)=> {setDueDate(e.target.value)
        setErrors({
            ...errors,
            dueDate:""
        })
    }
    }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
    {errors.dueDate && (
        <p className="text-red-500 text-sm">
            {errors.dueDate}
        </p>
    )}
    <label className="block font-semibold">
  Assignment Marks
</label>
<input
  type="number"
  min={1}
  value={marks}
  onChange={(e) => {setMarks(Number(e.target.value))
     setErrors({
            ...errors,
            marks:""
        })
  }}
  placeholder="e.g. 20"
       className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
/>
{errors.marks && (
    <p className="text-red-500 text-sm">
        {errors.marks}
    </p>
)}
<label className="block font-semibold">
  Estimated Time
</label>
  <select 
    value={estimatedTime}
    onChange={(e)=> {setEstimatedTime(e.target.value)
         setErrors({
            ...errors,
            estimatedTime:""
        })
    }}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
        <option value="">Choose estimated completion time</option>
        <option value="30min">30 min</option>
        <option value="1hr">1hr</option>
        <option value="2hr">2hr</option>
        <option value="3hr">3hr</option>
     </select> 
    {errors.estimatedTime && (
    <p className="text-red-500 text-sm">
        {errors.estimatedTime}
    </p>
)}
     <label className="block font-semibold">
  Assignment priority
</label>
    <select 
    value={priority}
   onChange={(e) =>{
  setPriority(
    e.target.value as "" | "Low" | "Medium" | "High"
  );
  setErrors({
    ...errors,
    priority:""
  });
}
}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
        <option value="">Select Priority</option>
<option value="Low">Low</option>
<option value="Medium">Medium</option>
<option value="High">High</option>
    </select>
    {errors.priority && (
        <p className="text-red-500 text-sm">
            {errors.priority}
        </p>
    )}
    <button
    type="submit"
    className="px-4 py-2 bg-black text-white rounded-lg"
    >{editingId===null ? "Save Assignment":"Update Assignment"}</button>
    </form>
  {
    assignments.length === 0 ? (
    <p>No assignments yet. Add your first assignment!</p>
) : (
    assignments.map((assignment)=>{
        const course=courses.find((course)=>
            course.id===assignment.courseId
    );
    const formattedDate= new Date(assignment.dueDate).toLocaleDateString(
        "en-US",{
            month:"short",
            day:"numeric",
            year:"numeric"
        }
    );
    return(
    <div key={assignment.id} className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition mt-4" >
    <h3 className="font-bold text-lg">
        📚Course: {course?.name}
    </h3>

    <p>
        📝Assignment Title: {assignment.title}
    </p>

    <p>
        📅 Due: {formattedDate}
    </p>

    <span
    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${priorityColors[assignment.priority]}`}
>
    {assignment.priority} Priority
</span>

    <p>
        ⏱ Estimated Time: {assignment.estimatedTime}
    </p>

    <p>
        🎯 Marks: {assignment.marks}
    </p>

    <div className="flex gap-2 pt-2">
        <button
            onClick={() => editAssignment(assignment.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
        >
            Edit
        </button>

        <button
            onClick={() => deleteAssignment(assignment.id)}
            className="px-3 py-1 bg-red-500 text-white rounded"
        >
            Delete
        </button>
    </div>
</div>
    );
    } ) 
)  }
</main>
);
}



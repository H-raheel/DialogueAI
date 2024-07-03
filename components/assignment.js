import { useRouter } from "next/router";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
export default function Assignment() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dialogueRole, setDialogueRole] = useState("");
  const [studentRole, setStudentRole] = useState("");
  const [aidescription, setaiDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [error, setError] = useState("");
  const userId = useSelector((state) => state.user);
const router=useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch student IDs for the teacher
      const studentsResponse = await fetch(`/api/get_students_for_teacher?user_id=${userId}`);
      if (!studentsResponse.ok) {
        const errorData = await studentsResponse.json();
        throw new Error(errorData.error || 'Failed to fetch student IDs');
      }
      const studentsData = await studentsResponse.json();
      const studentIds = studentsData.students;

      // Create assignment data
      const assignmentData = {
        assignment_name: title,
        due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
        student_ids: studentIds,
        description,
        student_class: 'class_here', // Replace with actual class information
        language,
        dialogue_ai_role: dialogueRole,
        student_role: studentRole,
        roleplay_description_ai: aidescription,
        teacher_id: userId,
      };

      // Create prompt data
      const promptData = {
        created_assignments: [],
        due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
        teacher_id: userId,
        student_ids: studentIds,
        assignment_description: description,
        language,
        dialogue_ai_role: dialogueRole,
        student_role: studentRole,
        roleplay_description_ai:  aidescription,
      };

      // Call API to create assignments
      const createAssignmentsResponse = await fetch('/api/create_assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      if (!createAssignmentsResponse.ok) {
        const errorData = await createAssignmentsResponse.json();
        throw new Error(errorData.error || 'Failed to create assignments');
      }

      const createAssignmentsResult = await createAssignmentsResponse.json();
      promptData.created_assignments = createAssignmentsResult.assignments;

      // Call API to create LLM prompt
      const createPromptResponse = await fetch('/api/create_llm_prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      });

      if (!createPromptResponse.ok) {
        const errorData = await createPromptResponse.json();
        throw new Error(errorData.error || 'Failed to create prompt');
      }
console.log(aidescription)
      // Reset form fields on success
      setTitle("");
      setDescription("");
      setDialogueRole("");
      setStudentRole("");
      setaiDescription("");
      
      setLanguage("");
      setDueDate(null);
      setError("");
      
      
      // Display success message
     
      console.log(promptData);
      router.push('/teacher/dashboard')
    } catch (error) {
      console.error('Error creating assignments:', error);
      setError('Error creating assignments');
    }
  };

  return (
    <div className="flex items-center justify-center pt-6 min-h-screen">
      <div className="flex flex-wrap w-full max-w-screen-lg">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
          <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full max-w-full flex-grow">
                <h2 className="text-white text-xl font-semibold">Assignment Page</h2>
              </div>
            </div>
          </div>
          <form className="p-6 flex-auto h-full overflow-y-auto" onSubmit={handleSubmit}>
            <div className="relative min-h-full">
              <div className="mb-4">
                <label htmlFor="assignmentTitle" className="block text-white text-sm font-semibold mb-2">Assignment Title</label>
                <input
                  type="text"
                  id="assignmentTitle"
                  className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Assignment Title (students will see this)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="assignmentDescription" className="block text-white text-sm font-semibold mb-2">Assignment Description for AI</label>
                <textarea
                  id="assignmentaiDescription"
                  className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300"
                  rows="5"
                  placeholder="Assignment Details (Write how you want the AI to behave eg:'Imagine you are a shoe seller....')"
                  value={aidescription}
                  onChange={(e) => setaiDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="assignmentDescription" className="block text-white text-sm font-semibold mb-2">Assignment Description</label>
                <textarea
                  id="assignmentDescription"
                  className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300"
                  rows="5"
                  placeholder="Assignment Details (students will see this)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="dialogueRole" className="block text-white text-sm font-semibold mb-2">DialogueAI Role</label>
                <input
                  type="text"
                  id="dialogueRole"
                  className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="The role of the chatbot in the roleplay e.g. cashier of a cafe"
                  value={dialogueRole}
                  onChange={(e) => setDialogueRole(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="studentRole" className="block text-white text-sm font-semibold mb-2">Student Role</label>
                <input
                  type="text"
                  id="studentRole"
                  className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="The role of the student in the roleplay e.g. customer in a cafe ordering coffee"
                  value={studentRole}
                  onChange={(e) => setStudentRole(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="language" className="block text-white text-sm font-semibold mb-2">Language</label>
                <input
                  type="text"
                  id="language"
                  className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Language used in the assignment"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-white text-sm font-semibold mb-2">Due Date</label>
                <DatePicker
                  id="dueDate"
                  className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300"
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  placeholderText="Select due date"
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  isClearable
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300">
                Create
              </button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

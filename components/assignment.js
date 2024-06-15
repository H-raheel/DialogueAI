export default function Assignment() {
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
            <form className="p-6 flex-auto h-full overflow-y-auto"> {/* Changed div to form */}
              <div className="relative min-h-full">
                <div className="mb-4">
                  <label htmlFor="exampleFormControlInput1" className="block text-white text-sm font-semibold mb-2">Assignment Title</label>
                  <input type="text" id="exampleFormControlInput1" className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300" placeholder="Assignment Title (students will see this)" />
                </div>
                <div className="mb-4">
                  <label htmlFor="exampleFormControlTextarea1" className="block text-white text-sm font-semibold mb-2">Assignment Description</label>
                  <textarea id="exampleFormControlTextarea1" className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300" rows="5" placeholder="Assignment Details (students will see this)"></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="exampleFormControlInput1" className="block text-white text-sm font-semibold mb-2">DialogueAI Role</label>
                  <input type="text" id="exampleFormControlInput1" className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300" placeholder="The role of the chatbot in the roleplay e.g. cashier of a cafe" />
                </div>
                <div className="mb-4">
                  <label htmlFor="exampleFormControlInput1" className="block text-white text-sm font-semibold mb-2">Student Role</label>
                  <input type="text" id="exampleFormControlInput1" className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300" placeholder="The role of the student in the roleplay e.g. customer in a cafe ordering coffee" />
                </div>
                <div className="mb-4">
                  <label htmlFor="exampleFormControlInput1" className="block text-white text-sm font-semibold mb-2">Roleplay Setting</label>
                  <input type="text" id="exampleFormControlInput1" className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300" placeholder="The roleplay setting e.g. small cafe in a small town" />
                </div>
                <div className="mb-4">
                  <label htmlFor="exampleFormControlInput1" className="block text-white text-sm font-semibold mb-2">Student Class</label>
                    <select name="class" id="class" className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300">
                        <option value="volvo">Year 2 English</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                    </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="exampleFormControlInput1" className="block text-white text-sm font-semibold mb-2">Student Name</label>
                    <select name="students" id="students" className="w-full px-3 py-2 text-white bg-blueGray-800 rounded focus:outline-none focus:ring focus:border-blue-300">
                        <option selected value="everyone">Everyone</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  

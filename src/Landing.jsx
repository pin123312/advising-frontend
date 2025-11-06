import Sidebar from './Sidebar.jsx'; 
import Header from './Header.jsx'
import AnnouncementList from './AnnouncementList.jsx';
import { SlCamrecorder } from "react-icons/sl";
import { CiFaceSmile } from "react-icons/ci";
import { useLocation } from "react-router-dom";
import { CiClock2 } from "react-icons/ci";
import { IoIosSchool } from "react-icons/io";
import { IoNewspaperOutline } from "react-icons/io5";
import { useUser } from "/src/hooks/useUser.js";
import { useState, useEffect} from 'react';

function Landing() {
    const { user } = useUser();
    const meetingItems = [ 
        {time: "10:00 AM", title: "Review Session with", course: "Computer Science 101", online: true}
    ]

    const meetingList = meetingItems.map(item => 
                                    <div className="p-2 flex flex-grow flex-col items-start pl-5">   
                                        <div className='text-blue-500'>{item.time} </div>
                                        <div><b>{item.title} </b></div>
                                        <div className="font-extralight">{item.course}</div>
                                        <div className='font-extralight pt-10 text-sm flex items-center'>
                                            {item.online ? <SlCamrecorder /> : <CiFaceSmile />} <span className="px-2">{item.online ? "Online" : "Face-to-Face"} Meeting</span>
                                        </div>
                                    </div>  

                                )
   

    const quickItems = [{id:1 , name: "View Schedule", icon: <CiClock2/>},
                        {id: 2, name: "My Course", icon: <IoIosSchool/>},
                        {id: 3, name: "Check Grades", icon: <IoNewspaperOutline/>},

    ]   ;

    const quickList = quickItems.map(quickItem => 
                            <div className='flex flex-row hover:not-focus:bg-blue-200 hover:text-blue-500 w-full' key = {quickItem.id}>
                                <span className='pt-3 pl-2 pr-2'>{quickItem.icon}</span> 
                                <button className="pt-2 hidden md:flex"> {quickItem.name}</button>
                            </div> 
    )
    
    const [content, setContent] = useState("");

    useEffect(() => {
    if (user?.user_role_id == "1") {
        setContent(
        
            <div className="flex flex-row min-w-screen">
                <div><Sidebar/></div>
                <div className="flex flex-col flex-grow p-4 space-y-6 ml-18 md:ml-42 lg:ml-50">
                    <Header title="Dashboard" buttonType="New Appointment"/>
                    <div className="flex flex-col rounded-sm h-auto w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white text-left border border-black">
                        <label className="font-bold text-lg p-2 border-b-1">Attachments</label>
                        <form>
                            <div className="flex flex-row p-2">
                                <div className='px-3 py-2 w-30'>Name</div>
                                <input
                                    type="search"
                                    id="search"
                                    name="search"
                                    placeholder="Insert Username, student id, email or contact"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="flex flex-row p-2">
                                <div className='px-3 py-2 w-30'>Lecturer</div>
                                <input
                                    type="search"
                                    id="search"
                                    name="search"
                                    placeholder="Insert Username, student id, email or contact"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="flex flex-row p-2 ">
                                <div className='px-3 py-2 w-30'>Role</div>
                                <input
                                    type="search"
                                    id="search"
                                    name="search"
                                    placeholder="Insert Username, student id, email or contact"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="flex flex-row p-2">
                                <div className='px-3 py-2 w-30'>Status</div>
                                <input
                                    type="search"
                                    id="search"
                                    name="search"
                                    placeholder="Insert Username, student id, email or contact"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className='flex flex-grow p-2'>
                                <button type="submit" className="w-30 ml-auto bg-blue-400 rounded-sm hover:bg-blue-200 focus:outline-none flex items-center justify-center p-1 text-white">
                                Search
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-col rounded-sm h-auto w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white text-left border border-black">
                        <label className="font-bold text-lg p-2 border-b-1">Action</label>
                        <form>
                            <div className="flex flex-row p-2">
                                <div className='px-3 py-2 w-30'>Action</div>
                                <select className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'>
                                    <option value="">Select Type</option>
                                    <option value="delete">Delete</option>
                                    <option value="lecturer_id">Change Lecturer</option>
                                </select>
                            </div>
                            <div className='flex flex-grow p-2'>
                                <button type="submit" className="w-30 ml-auto bg-blue-400 rounded-sm hover:bg-blue-200 focus:outline-none flex items-center justify-center p-1 text-white">
                                Search
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-col rounded-sm h-auto w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white text-left border border-black">
                        <label className="font-bold text-lg p-2 border-b-1">Users</label>
                        <div className="overflow-x-auto">
                            <div className="w-[30vh] md:w-[70vh] lg:w-[100vh] mx-auto p-3">
                                <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                    <th className="border border-gray-300 px-4 py-2">Role</th>
                                    <th className="border border-gray-300 px-4 py-2">Username</th>
                                    <th className="border border-gray-300 px-4 py-2">Student ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Email</th>
                                    <th className="border border-gray-300 px-4 py-2">Contact</th>
                                    <th className="border border-gray-300 px-4 py-2">Lecturer ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                    <th className="border border-gray-300 px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td className="border border-gray-300 px-4 py-2">Lecturer</td>
                                    <td className="border border-gray-300 px-4 py-2">John</td>
                                    <td className="border border-gray-300 px-4 py-2">ST001</td>
                                    <td className="border border-gray-300 px-4 py-2">john@example.com</td>
                                    <td className="border border-gray-300 px-4 py-2">+60123456789</td>
                                    <td className="border border-gray-300 px-4 py-2">LEC123</td>
                                    <td className="border border-gray-300 px-4 py-2 text-green-600">Active</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button className="text-blue-600 hover:underline">Edit</button>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                        </div>


                    </div>
                </div>
            </div>


        );
    } else {
        setContent(<div className="flex flex-row w-screen min-h-screen ">
                <div><Sidebar/></div>
                <div className="flex flex-col flex-grow p-4 w-full space-y-6 ml-13 md:ml-42 lg:ml-47">
                    <Header title="Dashboard" buttonType="New Appointment"/>
                    <div className="flex flex-col py-2 xl:flex-row ">
                        <div className='h-max px-5 w-100 md:w-150 lg:w-250 '>
                            <h2 className="text-left text-3xl font-bold pb-5">Upcoming Appointments</h2>
                            <div className="border-none bg-white rounded-xl h-50 flex flex-row flex-grow">
                                {meetingList}
                                <img src="https://placehold.co/150x100" alt="placeholder" className='rounded-xl p-2 mx-auto'></img>
                            </div>
                            <h2 className="text-left text-3xl font-bold pt-13">Recent Announcement</h2>
                            <div className="pt-10 flex flex-row flex-grow ">
                                <div className="border-none h-80 w-100 md:w-150 lg:w-245">
                                    <div className="space-y-4 ">
                                        <AnnouncementList/>
                                    </div>
                                </div>
                                

                            </div>
                            
                        </div>
                         <div className=' w-full p-2 space-y-10 flex flex-col items-center  '>
                            <div className="border-none bg-white rounded-xl h-80 w-120 ">
                                <h2 className="text-left text-2xl font-semibold p-5">Quick Actions</h2>
                                <div className="flex justify-between flex-col place-items-start p-5 h-50">
                                     {quickList}
                                   
                                </div>
                             
                                
                            </div>
                            
                        </div> 
                    </div>
                </div>   
            </div>);
    }
    }, [user]);

    return(
        <>  
            {content}
            
        </>
        
    );
}

export default Landing
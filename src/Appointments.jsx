import Sidebar from './Sidebar.jsx'; 
import Header from './Header.jsx'
import { CiMail } from "react-icons/ci";
import { IoIosCall } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { useUser } from "/src/hooks/useUser.js";
import { useState, useEffect} from 'react';
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";   
import api from "./api";

function Appointments() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;
    const { user, token} = useUser();
    const [appointmentData, setAppointmentData] = useState({});
    const [startItem , setStartItem] = useState(0);
    const itemsPerPage = 5;
    const endItem = startItem + itemsPerPage;
    
    const handleNext = () => {
        if (endItem < appointmentData.length) {
            setStartItem(startItem + itemsPerPage);
        }
    }

    const handlePrev = () => {
        if (startItem > 0) {
            setStartItem(startItem - itemsPerPage);
        }
    }
 
    useEffect(() => {
        const fetchAppointment = async () => {
            try {
            const res = await api.get(`/appointments/filter/${user.lecturer_id}`, {headers: { Authorization: `Bearer ${token}` } });
            setAppointmentData(res.data);
            // console.log(res.data);
            // console.log("appointment data set" + JSON.stringify(appointmentData));
            } catch (err) {
            console.error(err);
            } 
        };  

        if (user?.lecturer_id) {
            fetchAppointment();
        }

    }, [user]);

    return(
        <>  
        <div className="flex flex-row min-w-screen">
            <div><Sidebar/></div>
            <div className="flex flex-col flex-grow p-4 space-y-4 ml-18 md:ml-42 lg:ml-50">
                {user?.user_role_id !== 3 ? <Header title="Your Appointments" buttonType="Availability"/> : <Header title="Your Appointments" buttonType="Appointment"/>}
                <div className='text-left font-extralight'>View and mange your appointments with your assigned lecturer</div>
                <div className="flex flex-col rounded-xl h-150 md:h-120 lg:h-90 w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white p-5 overflow-x-auto lg:overflow-hidden">
                    <table className="min-w-full border-collapse border border-none rounded-lg">
                        <thead>
                            <tr className="border-b border-b-gray-300">
                            <th className=" px-4 py-2">Lecturer</th>
                            <th className=" px-4 py-2">Date</th>
                            <th className="px-4 py-2">Time</th>
                            <th className=" px-4 py-2">Status</th>
                            <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        
                        <tbody className=''>
                            {appointmentData && appointmentData.length > 0 ? (
                                appointmentData.slice(startItem,endItem).map((item, index) => (
                                    <tr key={index}>
                                    <td className="px-4 py-2">{item?.lecturer?.username}</td>
                                    <td className="px-4 py-2">{item.date}</td>
                                    <td className="px-4 py-2">
                                        {item.time?.[0]?.from} - {item.time?.[0]?.to}
                                    </td>
                                    <td className="px-4 py-2">{item?.status}</td>
                                    <td className="px-4 py-2">
                                        <button className="text-blue-500 hover:underline mr-2">Reschedule</button>
                                        <button className="text-red-500 hover:underline">Cancel</button>
                                    </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No appointments found.
                                    </td>
                                </tr>
                                )}
                            
                        </tbody>
                    </table>
                    <div className='mt-auto'>
                        <hr className="w-full mt-2 border-gray-300" />
                        <div className="flex flex-grow justify-between items-center p-4 text-sm font-extralight">
                            {`Showing ${startItem === 0 ? "1" : startItem}-${endItem} of ${appointmentData.length} appointments`}

                            
                        <div className="flex items-center gap-2">
                            <button onClick={() => handlePrev()} disabled={startItem === 0} className={`px-3 py-1 border rounded-md ${startItem === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}>
                                ‹
                            </button>
                            <button
                            onClick={() => handleNext()}
                            disabled={startItem > appointmentData.length}
                            className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                            >
                            ›
                            </button>
                        </div>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
        </>
    );
}

export default Appointments
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


function NewAppointment() {
    const { user, token } = useUser();
    const isStudent = user?.user_role_id !== "3";
    const [selected, setSelected] = useState();
    const [lecturerData, setLecturerData] = useState({});
    const [selectedTime, setSelectedTime] = useState("");
    const [appointmentData, setAppointmentData] = useState({});

    useEffect(() => {
        const fetchLecturer = async () => {
            try {
            const res = await api.get(`/users/${user.lecturer_id}`, {headers: { Authorization: `Bearer ${token}` } });
            const res2 = await api.get(`/appointments/filter/${user.lecturer_id}`, {headers: { Authorization: `Bearer ${token}` } });

            setLecturerData(res.data);
            setAppointmentData(res2.data);

            console.log("Lecturer Data:", res.data);
            console.log("Appointment Data:", res2.data);
            } catch (err) {
            console.error(err);
            } 
        };  

        if (user?.lecturer_id) {
            fetchLecturer();
        }

    }, [user, token]);

    const InfoRow = ({ label, value }) => (
    <div className="flex flex-row">
        <div className='text-lg font-bold w-30'>{label}</div>
        <div className='text-lg w-full'>{value}</div>
    </div>
    );

    const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
    };

    const availableDayTime = lecturerData?.lecturer_profile?.available_time;

    const expandedDays = Array.isArray(availableDayTime)
    ? availableDayTime.flatMap((item) => {
        const days = getDatesInRange(item.date.from, item.date.to);
        return days.map((day) => ({
            date: day,
            time: item.time,
        }));
        })
    : [];
    
    const bookedDayTime = Array.isArray(appointmentData)
    ? appointmentData.flatMap((item) =>
        (item.time || []).map((t) => ({
            date: new Date(item.date), 
            from: t.from,
            to: t.to,
        }))
        )
    : [];

    const isBooked = (day, from, to) => {
        return bookedDayTime.some(
            (b) =>
            b.date.toDateString() === day.toDateString() &&
            b.from === from &&
            b.to === to
        );
    };

    
    console.log("bookdaytime",bookedDayTime);

    const [formData, setFormData] = useState({
        date: "",
        time: [],
    });

    const [availabilityForm, setavailabilityForm] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData?.time || formData.time.length === 0) {
            alert("Please select at least one valid time slot");
            return;
        }
        console.log("selected"+ selected.toISOString().split("T")[0]);
        const newEntry = {
            date: selected.toISOString().split("T")[0],
            time: formData.time,
            
        };


        const updatedForm = [...availabilityForm, newEntry];
        setavailabilityForm(updatedForm);

        console.log("Updated availability:", updatedForm);

        try {


            const res = await api.post(`/appointments/${user?.id}/${user?.lecturer_id}`, 
            {
                date: selected.toISOString().split("T")[0],
                time: formData.time,
                status: "pending",
            },
            {
                headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}` },
            }
            );
            console.log("submit data booking" +  res.data);
            alert("Date Succesfully Added");


        } catch (err) {
            console.log(err);
            const message = err.response?.data?.message || "Network error. Please try again.";
        } 
    }

    return(
        <>  
            <div className="flex flex-row min-w-screen">
                <div><Sidebar/></div>
                <div className="flex flex-col flex-grow p-4 space-y-6 ml-18 md:ml-42 lg:ml-50">
                    <Header title="Book New Appointment" buttonType="asd"/>
                    {!isStudent && (
                        <>
                        <div className="flex flex-col rounded-xl h-150 md:h-60 w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white">
                        admin and lecturer view 
                        </div>
                        
                        </>
                    )}

                    {isStudent && (
                        <>  
                        <div className="flex flex-col rounded-xl md:h-60 w-[35vh] md:w-[70vh] lg:w-[100vh]">
                              
                               
                                
                                <div className="flex flex-col h-auto w-[35vh] md:w-[70vh] lg:w-[100vh] text-left rounded-2xl border border-gray-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-2 mb-2">
                                    <div className="border-none bg-white rounded-xl flex flex-row">
                                        <img src="https://placehold.co/60x60" alt="placeholder" className='rounded-xl p-2'></img>
                                        <div className='flex flex-col place-items-start'>
                                            <div  className="rounded-xl font-bold py-2"> 
                                                {lecturerData?.username}
                                            </div>
                                            <div className='rounded-xl font-light'>Assigned Lecturer</div>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col md:flex-row w-full bg-gray-50 space-y-5 items-start space-x-0 md:space-x-4 pb-5">
                                        <div className=" md:h-110 w-[100%] md:w-[65%] lg:w-[70%] rounded-2xl border border-gray-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]flex justify-center lg:pt-10">
                                            <DayPicker animate
                                            navLayout="around"
                                            mode="single"
                                            classNames={{
                                                today: `border-amber-500`, 
                                                selected: `bg-blue-300 text-white rounded-lg`, 
                                            }}
                                            disabled={(day) =>
                                            !expandedDays.some((d) => d.date.toDateString() === day.toDateString())}
                                            selected={selected}
                                            onSelect={setSelected}
                                            
                                            />
                                        </div>
                                        <div className="w-full md:w-[35%] lg:w-[30%] rounded-2xl border border-gray-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-4 h-auto md:h-110">
                                            <h3 className="font-medium mb-3">Available slots for {selected ? (
                                                <span>{selected.toLocaleDateString('en-US', 
                                                    {
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            ) : "No date selected yet"}</h3>
                                            
                                        {expandedDays
                                            .filter((d) => d.date.toDateString() === selected?.toDateString())
                                            .flatMap((d) => d.time)
                                            .map((time, index) => {
                                                const booked = isBooked(selected, time.from, time.to); 
                                                return (
                                                <div key={index} className="flex flex-col p-2">
                                                    <div
                                                    type="button"
                                                    onClick={() => {
                                                        if (!booked) { 
                                                        setSelectedTime(`${time.from} - ${time.to}`);
                                                        setFormData({
                                                            ...formData,
                                                            time: [{ from: time.from, to: time.to }],
                                                        });
                                                        }
                                                    }}
                                                    className={`border rounded-lg py-2 cursor-pointer text-center transition-all
                                                        ${
                                                        booked
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed" // booked slot
                                                            : selectedTime === `${time.from} - ${time.to}`
                                                            ? "bg-blue-400 text-white" // selected slot
                                                            : "hover:bg-gray-100 text-gray-800" // normal
                                                        }`}
                                                    >
                                                    {time.from} - {time.to}
                                                    {booked && <span className="ml-2 text-xs">(Booked)</span>}
                                                    </div>
                                                </div>
                                                );
                                            })}

                                        </div>
                                        
                                    </div>
                                    <div className="flex flex-col  h-auto w-[35vh] md:w-[70vh] lg:w-[100vh]  text-left rounded-2xl border border-gray-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-2">
                                        <label className="font-bold text-lg p-2">Confirm Your Appointments</label>
                                        <div className='p-5'>
                                            <InfoRow label="Lecturer:" value={lecturerData?.username} />
                                            <InfoRow label="Date:" value={selected ? (
                                                <span>{selected.toLocaleDateString('en-US', 
                                                    {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            ) : "No date selected yet"}/>
                                            <InfoRow label="Time:" value={selectedTime} />
                                            <InfoRow label="Location:" value={lecturerData?.lecturer_profile?.location} />
                                            
                                        </div>
                                        <div className='flex flex-grow p-2'>
                                            <button type="submit" className="w-auto ml-auto bg-blue-400 rounded-lg hover:bg-blue-200 focus:outline-none flex items-center justify-center p-2 text-white">
                                            Confirm Booking
                                            </button>
                                            
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default NewAppointment
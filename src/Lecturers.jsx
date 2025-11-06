import Sidebar from './Sidebar.jsx'; 
import Header from './Header.jsx'
import { CiMail } from "react-icons/ci";
import { IoIosCall } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { useUser } from "/src/hooks/useUser.js";
import { useEffect, useState } from 'react';
import { data, NavLink, useNavigate } from "react-router-dom";
import api from "./api";

function Lecturers() {
    const [lecturerData, setLecturerData] = useState({});
    const [loading, setLoading] = useState(true);
    const { user, token } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
            const fetchLecturer = async () => {
                try {
                const res = await api.get(`/users/${user.lecturer_id}`, {headers: { Authorization: `Bearer ${token}` } });
                setLecturerData(res.data);
                console.log(res.data);
                } catch (err) {
                console.error(err);
                } finally {
                setLoading(false);
                }
            };  
    
            if (user?.lecturer_id) {
                fetchLecturer();
            }

        }, [user]);

        const lecturerDetails = [ 
    {
        id: 1,
        name: "Dr. Eleanor Vance",
        department: "Computer Science",
        description: "Dr. Vance is a Senior Lecturer in Computer Science focusing on artificial intelligence and human-computer interaction. She has published work on ethical AI and usability in machine learning systems.",
        interest: ["Artificial Intelligence", "Human-Computer Interaction", "Ethics in Technology"]
    },
    //   {
    //     id: 2,
    //     name: "Prof. Rajesh Patel",
    //     department: "Mechanical Engineering",
    //     description: "Prof. Patel researches robotics and sustainable energy systems, with emphasis on renewable-powered manufacturing robots and collaborative automation.",
    //     interest: ["Robotics", "Renewable Energy", "Collaborative Automation"]
    //   },
    //   {
    //     id: 3,
    //     name: "Dr. Sophia Müller",
    //     department: "Physics",
    //     description: "Dr. Müller specializes in quantum mechanics and nanotechnology, developing quantum algorithms for materials science.",
    //     interest: ["Quantum Mechanics", "Nanotechnology", "Quantum Computing"]
    //   },
    //   {
    //     id: 4,
    //     name: "Dr. Carlos Ramirez",
    //     department: "Mathematics",
    //     description: "Dr. Ramirez teaches statistics and probability theory. His research explores stochastic models for data-driven decision-making.",
    //     interest: ["Statistics", "Probability", "Data Science"]
    //   },
    //   {
    //     id: 5,
    //     name: "Prof. Emily Zhang",
    //     department: "Psychology",
    //     description: "Prof. Zhang studies cognitive psychology and learning processes, focusing on how technology affects memory and attention.",
    //     interest: ["Cognitive Psychology", "Education", "Neuroscience"]
    //   }
    ];

 
    
        const lecturerList = lecturerDetails.map(item => 
                                        <div className="p-2 flex flex-col md:flex-row item">  
                                            <div className="w-full md:w-1/4 lg:w-100 h-full">
                                                 <img src="https://placehold.co/200x200" alt="placeholder" className='rounded-full p-2 mx-auto '></img>
                                            </div>
                                            <div className="flex flex-col items-start w-full md:w-3/4 h-full text-left"> 
                                                <h2 className="text-left text-1xl lg:text-3xl font-bold">{item.name}</h2>
                                                <div className='text-blue-500 pb-2'><b>Department of {item.department} </b></div>
                                                <div className="">{item.description}</div>
                                                <div className='font-extralight pt-3 text-sm flex items-center'>
                                                    <ul className="flex flex-row space-x-2 md:space-x-4">
                                                    {item.interest.map((interest, idx) => (                  
                                                            <li key={idx} className="p-1 md:p-2 bg-blue-100 text-blue-500 font-semibold rounded-3xl text-center">{interest}</li>
                                                    ))}
                                                     </ul>
                                                </div>
                                            </div>  
                                        </div>
                                    )
        
       const officeInfos = [
        {
            id: 1,
            officeDays: "Monday & Wednesday",
            officeTime: "10:00 AM – 12:00 PM",
            officeLocation: "Building 4, Room 301",
            email: "eleanor.vance@university.edu",
            phone: "+1 (555) 123-4567"
        },
        // {
        //     id: 2,
        //     officeDays: "Tuesday & Thursday",
        //     officeTime: "2:00 PM – 4:00 PM",
        //     officeLocation: "Engineering Complex, Room 210",
        //     email: "rajesh.patel@university.edu",
        //     phone: "+1 (555) 234-5678"
        // },
        // {
        //     id: 3,
        //     officeDays: "Wednesday & Friday",
        //     officeTime: "9:30 AM – 11:30 AM",
        //     officeLocation: "Science Building, Room 415",
        //     email: "sophia.muller@university.edu",
        //     phone: "+1 (555) 345-6789"
        // },
        // {
        //     id: 4,
        //     officeDays: "Monday & Thursday",
        //     officeTime: "1:00 PM – 3:00 PM",
        //     officeLocation: "Mathematics Hall, Room 102",
        //     email: "carlos.ramirez@university.edu",
        //     phone: "+1 (555) 456-7890"
        // },
        // {
        //     id: 5,
        //     officeDays: "Tuesday & Friday",
        //     officeTime: "10:00 AM – 12:00 PM",
        //     officeLocation: "Psychology Center, Room 220",
        //     email: "emily.zhang@university.edu",
        //     phone: "+1 (555) 567-8901"
        // }
        ];


        const officeList = officeInfos.map((officeInfo, idx) => {
            const officeSections = [
                {
                title: "OFFICE HOURS",
                content: [officeInfo.officeDays, officeInfo.officeTime],
                },
                {
                title: "OFFICE LOCATION",
                content: [officeInfo.officeLocation],
                },
                {
                title: "CONTACT DETAILS",
                content: [officeInfo.email, officeInfo.phone],
                },
            ];
            return (
                <div key={idx} className="flex flex-col md:flex-row place-content-evenly text-left md:items-center pb-3 md:pb-5">
                {officeSections.map((section, i) => (
                    <div key={i} className="flex flex-col text-left p-5">
                    <div className="font-semibold text-gray-500 uppercase text-sm tracking-wide">
                        {section.title}
                    </div>
                    {section.content.map((line, j) => (
                        <div key={j} className="text-gray-800">
                            {line.includes("@") ? <div className='flex items-center gap-2'><CiMail/> {line}</div> : 
                            line.includes("+") ? <div className='flex items-center gap-2'><IoIosCall/> {line} </div>: (line) }
                        
                        </div>
                    ))}
                    </div>
                ))}
                </div>
            );
        });

    return(
        <>
            <div className="flex flex-row min-w-screen">
                <div><Sidebar/></div>
                <div className="flex flex-col flex-grow p-4 space-y-6 ml-18 md:ml-42 lg:ml-50">
                    <Header title="My Assigned Lecturer" buttonTitle="New Appointment"/>
                    <div className="flex flex-col rounded-xl h-150 md:h-60 w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white">
                        {lecturerData?.lecturer_profile ? (
                            
                        <div className="p-2 flex flex-col md:flex-row item">  
                            <div className="w-full md:w-1/4 lg:w-100 h-full">
                                    <img src="https://placehold.co/200x200" alt="placeholder" className='rounded-full p-2 mx-auto '></img>
                            </div>
                            <div className="flex flex-col items-start w-full md:w-3/4 h-full text-left"> 
                                <h2 className="text-left text-1xl lg:text-3xl font-bold">{lecturerData?.username}</h2>
                                <div className='text-blue-500 pb-2'><b>Department of {lecturerData?.lecturer_profile?.department} </b></div>
                                <div className="">{lecturerData?.lecturer_profile?.bio}</div>
                                <div className='font-extralight pt-3 text-sm flex items-center'>
                                    <ul className="flex flex-row space-x-2 md:space-x-4">
                                    {lecturerData?.lecturer_profile?.interest.map((interest, idx) => (                  
                                            <li key={idx} className="p-1 md:p-2 bg-blue-100 text-blue-500 font-semibold rounded-3xl text-center">{interest}</li>
                                    ))}
                                        </ul>
                                </div>
                            </div>  
                        </div>

                        ) : (
                        lecturerList
                        )}
                        
                    </div>
                    <div className="flex flex-col rounded-xl h-130 md:h-80 w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white">
                        <div className='font-bold text-left px-5 pt-5 text-lg'>Contact & Office Information</div>
                        <div className='px-5'><hr className="w-full mt-2 border-gray-300 pt-5" /></div>
                        <div>
                            {officeList}
                            
                        </div>
                        <div className='px-5'><hr className="w-full mt-2 border-gray-300" /></div>
                        <div className="mt-auto m-5 bg-blue-400 rounded-sm hover:not-focus:bg-blue-200 hover:text-blue-500 ml-auto">
                            <button type="button" className="flex flex-row p-2 text-white" onClick={() => navigate("/appointments/book")}>
                                <div className="py-1 pl-3"><CiCalendar/> </div>
                                <div className="flex md:flex px-5 md:px-2">Book Appointment</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Lecturers
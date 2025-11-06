import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegCalendar } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { FaRegMessage } from "react-icons/fa6";
import viteLogo from '/src/assets/vite.svg'
import { FaGear } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "/src/hooks/useUser.js";
import axios from "axios";


function Sidebar() {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/"); 
    };

    // {
    //     name: "Dashboard",
    //     icon: <LuLayoutDashboard />,
    //     id: 1,
    //     path: "/landing"

    // },
    const items = [{
        name: "Announcement",
        icon: <FaRegCalendar/>,
        id: 2,
        path: "/announcement"
        
    },{
        name: "Appointments",
        icon: <FaRegCalendar/>,
        id: 3,
        path: "/appointments"
        
    }, {
        name: "My Lecturers",
        icon: <GoPeople/>,
        id: 4,
        path: "/Lecturers"
    }, 
    // {
    //     name: "Message",
    //     icon: <FaRegMessage/>,
    //     id: 5,
    //     path: "/message"
    // }

    ]   

    const itemList = items.map(item => 
        <li key ={item.id} > 
           <NavLink to={item.path} className="flex rounded-xl items-center hover:bg-blue-200 focus:outline-none py-2 px-4 ">{item.icon}  <span className="p-2 hidden md:flex">{item.name}</span></NavLink>
        </li>
    )   
    

    return(
        <>
            <nav className="border-none border-black rounded-sm w-16 md:w-45 lg:w-50 min-h-full text-black p-2 flex flex-col fixed">
                <ul className="list-none flex flex-col flex-grow">
                    <li className="flex rounded-xl items-center hover:bg-blue-200 focus:outline-none p-2 ">
                        <img src={viteLogo} className="Logo " alt="Vite Logo"/> <b className="p-2 hidden md:flex">Advisory</b> 
                    </li>
                    <li className="py-2 px-4 ">
                        <div className="flex flex-row">
                            <div><img src="/36332651_836.jpg" className="border rounded-xl w-10 " alt="profile pic"></img></div>
                            <div className="flex-col px-2 hidden md:flex">
                                <b>{user?.username}</b>
                                <span className="font-extralight">
                                  {user?.user_role_id === 2 ? "lecturer" : "student"}
                                </span>
                            </div>
                        </div>
                    </li>
                    {itemList}

                    
                    <div className="mt-auto">
                        <li > 
                            <NavLink to='/setting' className="flex rounded-xl items-center hover:bg-blue-200 focus:outline-none hover:text-blue-500 py-2 px-4 ">
                                <FaGear/>  <span className="p-2 hidden md:flex">Setting</span>
                            </NavLink>
                        </li>
                        <li><button onClick={handleLogout} className="flex rounded-xl items-center hover:bg-blue-200 focus:outline-none hover:text-blue-500 py-4 px-4 w-full">
                            Logout
                        </button></li>
                    </div>
                </ul>
            </nav>    
        </>
        
    );
}

export default Sidebar
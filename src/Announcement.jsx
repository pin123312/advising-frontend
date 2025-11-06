import Sidebar from "./Sidebar"
import Header from "./Header"
import AnnouncementList from "./AnnouncementList";
import { CiSearch } from "react-icons/ci";
import { useState, useRef, useEffect} from "react";

function Announcement() {

    const menuRef= useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [filterType, setFilterType] = useState("all");

    const handleOpen = (announcement) => {
        setSelectedAnnouncement(announcement);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedAnnouncement(null);
    };

    useEffect(() => {
          document.addEventListener('mousedown', handleClickOutside);
              
  
          return () => {
                  document.removeEventListener('mousedown', handleClickOutside);
              };
    }, []);
  
    function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            handleClose();
           
        }
    }
  
     

    return(
        <>
            <div className="flex flex-row w-screen min-h-screen ">
                <div><Sidebar/></div>
                <div className="flex flex-col flex-grow p-4 w-full space-y-6 ml-13 md:ml-42 lg:ml-49">
                    <Header title="Announcement" buttonType="Announcement"/>
                    <ul className="flex flex-row">
                        <li className="pr-2"><button className="bg-sky-200 hover:bg-sky-700 rounded-xl p-2 w-auto" onClick={() => setFilterType("all")}>All</button></li>
                        <li className="pr-2"> <button className="bg-sky-200 hover:bg-sky-700 rounded-xl p-2 w-auto" onClick={() => setFilterType("announcement")}>Announcements</button></li>
                        <li><button className="bg-sky-200 hover:bg-sky-700 rounded-xl p-2 w-auto" onClick={() => setFilterType("grade")}>Grades</button></li>
                    </ul>     
                    <h2 className="text-left text-3xl font-bold">Recent Announcement</h2>   
                    <div className="pt-5 flex flex-row flex-grow ">
                        <div className="border-none h-80 w-100 md:w-150 lg:w-245">
                            <div className="space-y-4 ">
                                <AnnouncementList filter={filterType} onOpen={handleOpen} />
                            </div>
                        </div>
                    </div>    
                </div>
            </div>  

            {openModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
                <div ref={menuRef} className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-3xl">
                    <h2 className="text-xl font-bold mb-2 text-left">
                    {selectedAnnouncement?.title}
                    </h2>
                    <div
                    className="text-black text-left"
                    dangerouslySetInnerHTML={{
                        __html: selectedAnnouncement?.content,
                    }}
                    />
                    <div className="flex justify-end mt-4">
                    <button
                        onClick={handleClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                    </div>
                </div>
                </div>
            )}        
           
        </>
    )

}

export default Announcement
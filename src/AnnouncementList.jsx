import api from "./api";
import { SlArrowRight } from "react-icons/sl";
import { useUser } from "/src/hooks/useUser.js";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

function AnnouncementList({ onOpen, filter }) {
    const { user, logout } = useUser();

    const [announcements, setAnnouncements] = useState([]);

    const fetchAnnouncements = async (filterType) => {
        try {
            let url = `/announcement/filter?lecturer_id=${user.lecturer_id}`;
            if (filterType && filterType !== "all") {
                url += `&type=${filterType}`;
            }

            const res = await api.get(url);
            setAnnouncements(res.data.data); 
        } catch (err) {
            console.error(err);
        }
    };
    
    useEffect(() => {
        if (user?.lecturer_id) {
            fetchAnnouncements(filter);
        }
    }, [filter, user]);

    const announceitems = [{id: 1, name: "Project Submission Reminder", info: "123"},
                                {id: 2, name: "Lecture Hall Change", info: "123"},
                                {id: 2, name: "Lecture Hall Change", info: "123"},
        ]; 
    
        const announceList = announceitems.map(announceitem => 
                                        <div className="border-none bg-white rounded-xl h-20 w-100 md:w-150 lg:w-240 flex flex-row">
                                            <img src="https://placehold.co/60x60" alt="placeholder" className='rounded-xl p-2'></img>
                                            <div className='flex flex-col place-items-start'>
                                                <div key ={announceitem.id} className="rounded-xl hover:not-focus:bg-blue-200 hover:text-blue-500 py-2"> 
                                                    {announceitem.name} 
                                                </div>
                                                <div className='rounded-xl hover:not-focus:bg-blue-200 hover:text-blue-500'>{announceitem.info}</div>
                                            </div>
                                            <button className='ml-auto'><SlArrowRight size={30}/></button>
                                            
                                        </div>
                                
                            )

        return(
            <>
            {/* {announceList} */}
            <div className="flex flex-col gap-4 mt-4">
                {announcements.length > 0 ? (
                    announcements.map((item) => (
                    <div
                        key={item.id}
                        className="border-none bg-white rounded-xl h-20 w-full md:w-[600px] lg:w-[800px] flex flex-row items-center shadow-sm hover:shadow-md transition text-left"
                    >
                        <img
                        src="https://placehold.co/60x60"
                        alt="placeholder"
                        className="rounded-xl p-2"
                        />
                        <div className="flex flex-col flex-1 pl-2">
                        <div className="font-semibold text-gray-800">{item.title}</div>
                        <div className="font-semibold text-gray-800"><div
                            className="text-sm text-gray-500 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: item.content }}/>

                        </div>
                        </div>
                        <button className="ml-auto p-2 hover:text-blue-500" onClick={() => onOpen(item)}>
                        <SlArrowRight size={22} />
                        </button>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">No announcements found.</p>
                )}
            </div>
            </>
        )
    
}


export default AnnouncementList
import { FaPlus } from "react-icons/fa";
import { useState, useRef, useEffect} from "react";
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent, useEditorState  } from '@tiptap/react'
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview);
import { MdFormatListBulleted, MdFormatListNumbered} from "react-icons/md";
import api from "./api";
import { useUser } from "/src/hooks/useUser.js";
import { data, NavLink, useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";  
import { IoMdAdd, IoMdRemove   } from "react-icons/io";

function Header({title,buttonType}) {
    const [selected, setSelected] = useState();
    const navigate = useNavigate();
    const { user, token } = useUser();
    const buttonTitle = String(buttonType);
    const menuRef= useRef(null);
    const [openMenu, setOpenMenu] = useState({open: false, value: "none"});
    const [active, setActive] = useState({ bold: false, italic: false, underline: false, bulletList: false, numberList: false});
    
    const [availableTime, setavailableTime] = useState([
        {from: "", to: "" },
        ]);

        const handleAddField = () => {
            setavailableTime([...availableTime, {from: "", to: "" }]);
        };

        const handleRemoveField = () => {
            setavailableTime(prev => 
            prev.length > 1 ? prev.slice(0, -1) : prev
        );
    };

    const handleChange = (index, field, value) => {
        const updated = [...availableTime];
        updated[index][field] = value; 
        setavailableTime(updated);
    };

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Type here...</p>',
        onUpdate: ({ editor }) => {
            setForm((prev) => ({ ...prev, content: editor.getHTML() }));
        },

    })

     const editorState = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold: ctx.editor.isActive('bold'),
            isItalic: ctx.editor.isActive('italic'),
            isUnderline: ctx.editor.isActive('underline'),
            isBulletList: ctx.editor.isActive('bulletList'),
            isOrderedList: ctx.editor.isActive('orderedList'),
        }),
    });

    const [form, setForm] = useState({
        lecturer_id: "",
        type: "",
        title: "",
        content: "",
        attachments: [],
    });

    useEffect(() => {
        setActive({ bold: false, italic: false, underline: false });
        document.addEventListener('mousedown', handleClickOutside);
            

        return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
    }, []);

    function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpenMenu({open: false, value: ""})
            editor?.commands.setContent('<p>Type here...</p>'); 
            if (availableTime.length < 2 ) {
                setavailableTime([...availableTime, { from: "", to: "" }]);
            }else {
                setavailableTime([]);
            }
            
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // // console.log("Form data:", form);
        

        try {
            const formData = new FormData();
            formData.append("lecturer_id" , user?.lecturer_id)
            formData.append("type", form.type);
            formData.append("title", form.title);
            formData.append("content", form.content);

            form.attachments.forEach((file) => {
                formData.append("attachments[]", file);
            });
            const res = await api.post("/announcement", formData, {
                headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` },
            });

            alert("Created announcement successfully!");
        } catch (err) {
            const message = err.response?.data?.message || "Network error. Please try againasd.";
        } 

        editor?.commands.setContent("<p>Type here...</p>");
        setOpenMenu({ open: false, value: "" });

    }


    const [availabilityForm, setavailabilityForm] = useState([]);

    const handleSetAvailability = async (e) => {
        e.preventDefault();
        
        const validTimes = availableTime.filter(
            (slot) => slot.from && slot.to
        );

        if (validTimes.length === 0) {
            alert("Please fill at least one valid time slot before saving.");
            return;
        }

        const newEntry = {
            date: {
                ...(selected?.from && { from: selected.from.toLocaleDateString("en-CA") }),
                ...(selected?.to && { to: selected.to.toLocaleDateString("en-CA") }),
            },
            time: validTimes,
            
        };

        const updatedForm = [...availabilityForm, newEntry];
        setavailabilityForm(updatedForm);

        try {
            const res = await api.post(`/lecturer-profile/${user?.id}`, 
                {available_time: updatedForm}, 
                {headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`},
            });

            alert("Date Succesfully Added");
            setOpenMenu({open: false, value: ""})

            const updatedProfile = await api.get(`/lecturer-profile/${user?.id}`, {headers: { Authorization: `Bearer ${token}` }});

            setUser((prev) => ({
            ...prev,
            lecturer_profile: updatedProfile.data,
            }));


        } catch (err) {
            const message = err.response?.data?.message || "Network error. Please try again.";
        } 
    }

    const [lecturerData, setLecturerData] = useState({});
    useEffect(() => {
            const fetchLecturer = async (e) => {
                try {
                const res = await api.get(`/users/${user.lecturer_id}`, {headers: { Authorization: `Bearer ${token}` }});
                setLecturerData(res.data);
                } catch (err) {
                console.error(err);
                } 
            };  
    
            if (user?.lecturer_id) {
                fetchLecturer();
            }

        }, [user]);

    let availableDay = [];

    const availableDayTime = lecturerData?.lecturer_profile?.available_time;

    if (Array.isArray(availableDayTime) && availableDayTime.length > 0) {
    availableDay = availableDayTime.map(item => ({
        from: new Date(item.date.from),
        to: new Date(item.date.to)
    }));
    } else {
        availableDay = [];
    }
            
    function renderMenu(value) {
        switch(value) {
            case "Announcement":
                return(
                    <div className="text-left">
                        <label className="font-bold text-lg">Type</label>
                        <div className="flex flex-col bg-gray-200 rounded-xl">
                            <select
                                className="font-semibold p-2 border-black w-full"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                >
                                <option value="">Select Type</option>
                                <option value="announcement">Announcement</option>
                                <option value="grade">Grades</option>
                            </select>
                        </div>
                        <div className="pt-2">
                            <label className="font-bold text-lg">Announcement Title</label>
                            <div className="flex flex-col bg-gray-200 rounded-xl">
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Enter a clear and concise title"
                                        className="font-semibold p-2 border-black w-full"
                                    /> 
                            </div>
                        </div>
                        <div className="pt-10">
                            <label className="font-bold text-lg">Content</label>
                            <div className="border rounded-md bg-white p-3">
                            <div className="flex gap-2 mb-2">
                                 <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={`px-2 py-1 rounded ${
                                        editorState.isBold ? "bg-blue-300" : "bg-gray-100"
                                    }`}
                                    >
                                    <b>B</b>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={`px-2 py-1 rounded ${
                                    editorState.isItalic  ? "bg-blue-300" : "bg-gray-100"
                                }`}
                                >
                                <i>I</i>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                                    className={`px-2 py-1 rounded ${
                                    editorState.isUnderline ? "bg-blue-300" : "bg-gray-100"
                                }`}
                                >
                                <u>U</u>
                                </button>
                                <div className="border-r-2 border-black"></div>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    className={`px-2 py-1 rounded ${
                                        editorState.isBulletList? "bg-blue-300" : "bg-gray-100"
                                    }`}>
                                    <MdFormatListBulleted/>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    className={`px-2 py-1 rounded ${
                                        editorState.isOrderedList? "bg-blue-300" : "bg-gray-100"
                                    }`}>
                                    <MdFormatListNumbered/>
                                </button>                              
                            </div>
                            <EditorContent editor={editor} className="bg-gray-50 rounded p-2 min-h-[200px]" />
                            </div>
                        </div>
                        <div className="pt-5">
                            <label className="font-bold text-lg">Attachments</label>
                                <div className="my-file-uploader" >
                                    <FilePond
                                        files={form.attachments}
                                        onupdatefiles={(items) =>
                                            setForm((prev) => ({
                                            ...prev,
                                            attachments: items.map((fileItem) => fileItem.file),
                                            }))
                                        }
                                        allowMultiple={true}
                                        maxFiles={5}
                                        name="files"
                                         labelIdle={`<div style="display:flex;align-items:center;gap:8px;justify-content:center;">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" width="32" height="32">
                                            <path d="M16.59 9H15V4H9v5H7.41L12 13.59 16.59 9zM5 18v-2h14v2H5z"/>
                                            </svg>
                                            <span>Drag & Drop your files or <span class="filepond--label-action">Browse</span></span>
                                        </div>`}
                                        server={null} 
                                        instantUpload={false}
                                    />
                            </div>
                        </div>
                    </div>
                );
            case "Availability":
                return(
                <>
                    <div className="flex flex-col md:flex-row space-y-4">
                        <div className=" md:h-110 w-[100%] md:w-[65%] lg:w-[40%] rounded-2xl border border-gray-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex justify-center lg:pt-10">
                            <DayPicker animate
                            mode="range"
                            navLayout="around"
                            className="availableDay"
                            classNames={{
                                today: `border-amber-500`, 
                                selected: `bg-blue-300 text-white rounded-lg`, 
                            }}
                            disabled={availableDay}
                            selected={selected}
                            onSelect={setSelected}
                            />
                        </div>
                        {/* <div className="w-px md:h-110 bg-gray-500"></div> */}
                        <div className="w-full md:w-[50%] lg:w-[60%] rounded-2xl border border-gray-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-4 h-auto ">
                            <div className="text-left text-gray-500 space-y-2">
                                <p>Select a date or range, then define your available hours below.</p>
                                <span className="font-bold text-black flex flex-row">
                                    Available Hours
                                   <button type="button" onClick={handleAddField} className="ml-auto py-1 w-auto bg-blue-400 rounded-sm hover:bg-blue-200 focus:outline-none flex items-center justify-center p-2 text-white"><IoMdAdd /></button> 
                                   <button type="button" onClick={handleRemoveField} className="ml-2 py-1 w-auto bg-blue-400 rounded-sm hover:bg-blue-200 focus:outline-none flex items-center justify-center p-2 text-white"><IoMdRemove  /></button> 
                                </span>
                            </div>
                                {availableTime.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-row text-left w-full space-x-4 items-end pb-2"
                                    >
                                        <div className="flex flex-col w-1/2">
                                        <div className="text-gray-400">From</div>
                                        <input
                                            type="time"
                                            value={slot.from}
                                            onChange={(e) => handleChange(index, "from", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        </div>

                                        <div className="flex flex-col w-1/2">
                                        <div className="text-gray-400">To</div>
                                        <input
                                            type="time"  
                                            value={slot.to}
                                            onChange={(e) => handleChange(index, "to", e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        </div>
                                    </div>
                                    ))}

                                  <div className="flex justify-end space-x-2 mt-6">
                                    <button
                                    type="button"
                                    onClick={() => setOpenMenu({ open: false, value: "" })}
                                    className="bg-gray-200 rounded-sm hover:bg-blue-200 focus:outline-none flex items-center justify-center px-4 py-2 text-black"
                                    >
                                    Cancel
                                    </button>
                                    <button
                                    onClick={handleSetAvailability}
                                    type="submit"
                                    className="bg-blue-400 rounded-sm hover:bg-blue-200 focus:outline-none flex items-center justify-center px-4 py-2 text-white"
                                    >
                                    Save Changes
                                    </button>
                                </div>
                        </div>
                      
                        
                        
                    </div>
                </>
            );
            default:
                <div>bbb</div>
        }
    }

    

    return(
        <>
    
        <header className="flex flex-col w-[30vh] md:w-[70vh] lg:w-[101vh]">
            <div className="flex items-center justify-between">
                <h1 className="text-left text-3xl lg:text-5xl font-semibold">{title}</h1>
                
                    <button type="button" className={`flex flex-row py-1 text-white ${
                        buttonTitle === "Announcement" || buttonTitle === "Appointment" || buttonTitle === "Availability"
                        ? (buttonTitle === "Announcement" && user?.user_role_id === 3
                            ? "hidden"
                            : "bg-blue-400 rounded-sm")
                        : "hidden"
                    }`} onClick={() => buttonTitle === "Appointment" ? navigate("/appointments/book") : setOpenMenu({open: true, value: buttonTitle}) }>
                        <div className="py-0.5 px-2 md:py-1 md:pl-3"><FaPlus/> </div>
                        <div className="hidden md:flex px-2">New {buttonTitle}</div>
                        
                    </button>

                    

                
                <div ref={menuRef} className={`menu ${openMenu.open ? 'open' : ''} flex flex-grow flex-col bg-red-500`}  onClick={(e) => e.stopPropagation()} >
                    <form className='h-full w-full flex flex-col flex-grow p-2' onSubmit={handleSubmit}>
                        
                        <div className=''>
                            {renderMenu(openMenu.value)}
                        </div>
                        {buttonType === "Availability" ? <div></div> : <button type="submit" className="w-full mt-auto bg-blue-400 rounded-sm hover:bg-blue-200 focus:outline-none flex items-center justify-center p-2 text-white">
                            Save
                        </button>}
                        
                    </form>
                        
                    
                </div>
            </div>
            
            <hr className="w-full mt-2 border-gray-300" />
        </header>
    
        </>
    )
}


export default Header
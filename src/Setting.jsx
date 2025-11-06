import Sidebar from './Sidebar.jsx'; 
import Header from './Header.jsx'
import { useState, useRef, useEffect} from 'react'
import { FaRegEdit } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";
import { useUser } from "/src/hooks/useUser.js";
import api from "./api";

function Setting() {

    const { user, logout } = useUser();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [openSidebar, setOpenSidebar] = useState({open: false, value: "none"});
    const sidebarRef = useRef(null);
    const buttonRef = useRef(null);
    const [validation, setValidation] = useState(<div className="pt-2 pb-2">
                New Password must:
                <ul>
                    <li className='flex flex-row'><span className='pt-1 pr-1'><FaExclamationCircle/></span> Be Between 8 - 20 characters</li>
                    <li className='flex flex-row'><span className='pt-1 pr-1'><FaExclamationCircle/></span>{`Contain at least one special character (~!@#$%^&*_-+=\`|(){}[]:;"'<>,.?/)`}</li>
                    <li className='flex flex-row'><span className='pt-1 pr-1'><FaExclamationCircle/></span>Contain at least one number (0-9)</li>
                    <li className='flex flex-row'><span className='pt-1 pr-1'><FaExclamationCircle/></span>Contain at least one capital letters</li>
                </ul>
            </div>);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("Password is not the same");
    const [formValidation , setFormValidation] = useState("");
    const displayName = `${firstName} ${lastName}`.trim();
    const [oldPassword, setOldPassword] = useState("");
    

    useEffect(() => {
   
    document.addEventListener('mousedown', handleClickOutside);


    return () => {
             document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleClickOutside(event) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setOpenSidebar({open: false, value: ""})
        }
    }

    function inputValidation(input, type) {
        setPassword(input);
        let regex = "";

        if (type === "name") {
            regex = /^[a-zA-Z\d]{8,20}$/;
        } else if (type === "password") {
            regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*_\-+=`|(){}\[\]:;"'<>,.?/])[A-Za-z\d~!@#$%^&*_\-+=`|(){}\[\]:;"'<>,.?/]{8,20}$/;
        }
        // setValidation(input);
        const isValid = regex.test(input);
        setValidation(isValid ? <div></div>: 
            <div className="pt-2 pb-2">
                New Password must:
                <ul>
                    <li className='flex flex-row'><span className='pt-1 pr-1'><FaExclamationCircle/></span> Be Between 8 - 20 characters</li>
                    <li className='flex flex-row'><span className='pt-1 pr-1'><FaExclamationCircle/></span>{`Contain at least one special character (~!@#$%^&*_-+=\`|(){}[]:;"'<>,.?/)`}</li>
                    <li className='flex flex-row'><span className='pt-1 pr-1'><FaExclamationCircle/></span>Contain at least one number (0-9)</li>
                    <li className='flex flex-row'><span className='pt-1 pr-1'><FaExclamationCircle/></span>Contain at least one capital letters</li>
                </ul>
            </div>);
    }

    function passwordCheck(input) {
        buttonRef.current.disabled = false;
        if (input == "") {
            setConfirmPassword("");
        }else if (input == password) {
            setConfirmPassword("");
        }else {
            setConfirmPassword("Password is not the same");
            buttonRef.current.disabled = true;   
        }
    }
    const [currentPage, setCurrentPage] = useState("");
    const [formData, setFormData] = useState({
        email: user?.email,
        old_pass: "",
        new_pass: "",
        name: "",
        profile_pic: "",

    });

    const [response, setResponse] = useState("");
    const responseRef = useRef(null);

    const handlesubmit = async (e) => {
        e.preventDefault();
        setResponse("");
        responseRef.current.classList.add("hidden", "bg-red-500");
        responseRef.current.classList.remove("bg-green-500");

        const updatedData = {
            ...formData,
            old_pass: oldPassword,
            new_pass: password,
            name: displayName,
        };

        const data = {
            email: updatedData.email,
            password: updatedData.old_pass,
        };
        console.log("data" + JSON.stringify(data));
        try {

            const res = await api.post("/users/login", data, {
            headers: { "Content-Type": "application/json" },
            });
            if (res.status === 200 && res.data.user) {
                 console.log(res);
                    const token = res.data.token; 
                    const res2 = await api.put(`/users/${user?.id}`, {username: user?.username, password: password}, {
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                        
                    });
                    console.log(res2);
                    setResponse("Password changed Succesfully");
                    responseRef.current.classList.remove("hidden", "bg-red-500");
                    responseRef.current.classList.add("bg-green-500");
                    

            }

        } catch (err) {
            console.log(err);
            const message = err.response?.data?.message || "Network error. Please try againasd.";
            setResponse(message);
            responseRef.current.classList.remove("hidden");

        } 

    }

    function renderSidebar(value) {
        switch(value) {
            case "img":
                return(
                    <div>
                        <h2 className="text-left text-1xl lg:text-2xl font-bold">Change Profile Picture</h2>
                        <img src="https://placehold.co/400x400" alt="placeholder" className='rounded-full p-2 mx-auto'></img>
                        <input type="file" className='w-full p-2 border-2 border-dashed rounded bg-gray-300 mt-5 flex justify-center item'></input>
                    </div>
                );
            case "password":
                return(
                <div>
                    <h2 className="text-left text-1xl lg:text-2xl font-bold">Change Password</h2>
                    <div><hr className="w-full mt-2 border-gray-300 pt-5" /></div>
                    <div className="rounded-lg bg-red-500 p-2 hidden text-center" ref={responseRef}>{response}</div>
                    <div>You can change your password here.</div>
                    <div>Your password is case sensitive and must meet the requirements listed below.</div>
                    <label>Old Password</label>
                    <input type="text" onChange={(e) => setOldPassword(e.target.value)} className='w-full p-2 border border-gray-300 rounded bg-white' placeholder='Old Password' value={oldPassword}></input>
                    <label>New Password</label>
                   <input onChange={e => inputValidation(e.target.value, "password")} type="text" className='w-full p-2 border border-gray-300 rounded bg-white' placeholder='New Password'></input>
                   <div>{validation}</div>
                   <label>Confirm New Password</label>
                   <input onChange={i => passwordCheck(i.target.value)} type="text" className='w-full p-2 border border-gray-300 rounded bg-white' placeholder='Confirm Password'></input>
                   <div>{confirmPassword}</div>
                </div>
            );
                    
            case "name": 
            return(
                <div>
                    <h2 className="text-left text-1xl lg:text-2xl font-bold">Contact Information</h2>
                    <div><hr className="w-full mt-2 border-gray-300 pt-5" /></div>
                    <h3 className="text-left text-1xl lg:text-1xl font-bold">Basic Information</h3>
                    <div><hr className="w-full mt-2 border-gray-300 pt-5" /></div>
                    <label>First Name</label>
                    <input onChange={e=> {setFirstName(e.target.value)}} type="text" className='w-full p-2 border border-gray-300 rounded bg-white' placeholder='First Name' value={firstName}></input>
                    <label>Last Name</label>
                    <input onChange={e=> {setLastName(e.target.value)}} type="text" className='w-full p-2 border border-gray-300 rounded bg-white' placeholder='Last Name' value={lastName}></input>
                    <div className="font-semibold pb-1 pt-2">Email</div>
                    <div>{user?.email}</div>
                    <h3 className="text-left text-1xl lg:text-1xl font-bold pt-5">Additional Information</h3>
                    <div><hr className="w-full mt-2 border-gray-300 pt-5" /></div>
                    <div className="font-semibold pb-1">Student ID</div>
                    <div>{user?.student_id}</div>
                    <h3 className="text-left text-1xl lg:text-1xl font-bold pt-5">Preview</h3>
                    <div><hr className="w-full mt-2 border-gray-300 pt-5" /></div>
                    <div className="bordewr bg-white w-full h-40 rounded-xl flex flex-row">
                        <img src="https://placehold.co/25x25" alt="placeholder" className='rounded-full p-2 w-25 h-25'></img>
                        <div className='text-center p-5'>{displayName}</div>
                    </div>
                </div>
            );
            default:
                <div></div>
        }
    }

    
        

    return(
        <>
            <div className="flex flex-row min-w-screen">
                <div><Sidebar/></div>
                <div className="flex flex-col flex-grow p-4 space-y-6 ml-18 md:ml-42 lg:ml-50">
                    <Header title="Setting" buttonType="New Appointment"/>
                    
                    <div className="flex flex-col h-150 md:h-60 w-[30vh] md:w-[70vh] lg:w-[100vh] text-left">
                        <div class="relative inline-block ">
                            <img src="https://placehold.co/200x200" alt="placeholder" className='rounded-full p-2 mx-auto'></img>
                            <div class="absolute pl-45 md:pl-92 lg:pl-125 inset-y-3 lg:inset-y-2 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 ">
                                <button onClick={() => setOpenSidebar({open: true, value: "img"})} class="border rounded-full p-2 bg-white text-black"><FaRegEdit/></button>
                            </div>
                            <div className='text-lg font-bold text-center'>Full Name</div>
                        </div>
                        <div ref={sidebarRef} className={`sidebar ${openSidebar.open ? 'open' : ''} flex flex-grow flex-col bg-red-500`}>
                            <form onSubmit={handlesubmit} className='h-full w-full flex flex-col flex-grow p-2'>
                                
                                <div className=''>
                                    Profile Settings
                                    {renderSidebar(openSidebar.value)}
                                </div>
                               {openSidebar.value === "img" ? <div></div>: <button type="submit" ref={buttonRef} className="w-full mt-auto bg-blue-400 rounded-sm hover:bg-blue-200 focus:outline-none flex items-center justify-center p-2 text-white">
                                    Save
                                </button>}
                            </form>
                             
                            
                        </div>
                        <h2 className="text-left text-1xl lg:text-2xl font-bold">Profile</h2>
                        <div className='pt-6 w-full'>
                                <div className="mb-4 flex flex-row gap-10">
                                    <div className='w-1/2 flex flex-col'>
                                        <div>Full Name</div>
                                        <div className='w-full p-2 border border-gray-300 rounded bg-white flex flex-row'>
                                            <button onClick={() => setOpenSidebar({open: true, value: "name"})} className="py-1 ml-auto flex flex-row flex-grow">
                                                {user?.username}
                                                <div className='py-1 ml-auto '><FaRegEdit/> </div>
                                                </button>
                                        </div>
                                    </div>
                                   <div className='w-1/2 flex flex-col'>
                                        <div>Email</div>
                                        <div className='w-full p-2 border border-gray-300 rounded bg-white'>{user?.email}</div>
                                    </div>
                                </div>
                                <div className="mb-4 flex flex-row gap-10">
                                    <div className='w-1/2 flex flex-col'>
                                        <div>Phone Number</div>
                                        <div className='w-full p-2 border border-gray-300 rounded bg-white'>asd</div>
                                    </div>
                                   <div className='w-1/2 flex flex-col'>
                                        <div>Student ID</div>
                                        <div className='w-full p-2 border border-gray-300 rounded bg-white'>{user?.student_id}</div>
                                    </div>
                                </div>
                            </div>
                        <h2 className="text-left text-1xl lg:text-2xl font-bold">Account</h2>
                        <div className="mt-5 bg-blue-400 rounded-sm hover:bg-blue-200 focus:outline-none mr-auto">
                            <button onClick={() => setOpenSidebar({open: true, value: "password"})} type="button" className="flex flex-row p-2 text-white items-center " >
                                <div className="flex md:flex px-5 md:px-2">Change password</div>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default Setting
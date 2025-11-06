import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import api from "./api";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Signup() {
const [form , setForm] = useState({
        username: "",
        user_role_id: 3,
        student_id: "",
        email: "",
        password: "",
    });

const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/register", form);
      console.log("User created:", res.data);
      alert("User registered successfully!");
    } catch (err) {
      console.error("Validation error:", err.response?.data);
      alert("Error creating user");
    }
  };

const passwordRef = useRef(null);
const inputRef = useRef(null);
const [hidePassword, setHidePassword] = useState(true);
const [validation, setValidation] = useState("");
function handlePassword() {
    setHidePassword((prev) => (!prev));

}

const PasswordRules = () => (
  <div className="bg-blue-200 p-2">
    <ul>
      <li className="flex flex-row"><span className="pt-1 pr-1"><FaExclamationCircle/></span> Be Between 8 - 20 characters</li>
      <li className="flex items-start text-left"><span className="pt-1 pr-1"><FaExclamationCircle /></span>{'Contain at least one special character (~!@#$%^&*_-+=`|(){}[]:;"\'<>,.?/)' }</li>
      <li className="flex flex-row"><span className="pt-1 pr-1"><FaExclamationCircle/></span>Contain at least one number (0-9)</li>
      <li className="flex flex-row"><span className="pt-1 pr-1"><FaExclamationCircle/></span>Contain at least one capital letter</li>
    </ul>
  </div>
);

useEffect(() => {
   
    document.addEventListener('click', handleClickOutside);


    return () => {
             document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    function handleClickOutside(event) {
        if (passwordRef.current && !passwordRef.current.contains(event.target)) {
            setValidation("");
        }

        if (inputRef.current.contains(event.target)) {
            setValidation(<PasswordRules/>);
        }
    }


function inputValidation(input, type) {
        let regex = "";

        if (type === "name") {
            regex = /^[a-zA-Z\d]{8,20}$/;
        } else if (type === "password") {
            regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*_\-+=`|(){}\[\]:;"'<>,.?/])[A-Za-z\d~!@#$%^&*_\-+=`|(){}\[\]:;"'<>,.?/]{8,20}$/;
            setForm({ ...form, password: input });
        }


        // setValidation(input);
        const isValid = regex.test(input);
        setValidation(isValid ? <div></div>: 
            <PasswordRules/>)
    }

    return (
        <>
        <div className='w-screen h-screen flex flex-row'>
           <div className="flex flex-row p-4 m-auto rounded-4xl h-150 md:h-150 w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white">
                 <div className='w-140 h-full flex flex-col pt-5'>
                        <h2 className="text-1xl lg:text-2xl font-bold">Sign up</h2>
                        <p className="pb-5">Get started by creating an accoun</p>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input
                            type="text"
                            name="username"
                            value={form.username} 
                            onChange={handleChange}
                            placeholder="Full name"
                            required
                            className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                    
                            <input
                            type="text"
                            name="student_id"
                            value={form.student_id}
                            onChange={handleChange}
                            placeholder="Student ID"
                            required
                            className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            
                            <div
                            className="
                                flex items-center 
                                border border-gray-300 rounded-full 
                                px-4 py-3 
                                focus-within:ring-2 focus-within:ring-blue-400 
                                transition
                            "
                            >
                            <input
                                type={hidePassword ? "password" : "text"}
                                placeholder="Password"
                                required
                                name="password"
                                value={form.password}
                                ref={inputRef}
                                className="
                                flex-1 bg-transparent 
                                text-gray-700 
                                border-none 
                                outline-none 
                                placeholder-gray-400
                                "
                                // onChange={e => setPassword(e.target.value)}
                                onChange={e => inputValidation(e.target.value, "password")}
                                
                            />
                            <button
                                type="button"
                                onClick={handlePassword}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none ml-2"
                            >
                                {hidePassword ? <FaRegEyeSlash  /> : <FaRegEye/>}
                            </button>
                            </div>
                            <div ref={passwordRef} className=" text-sm text-gray-600">
                                {validation}
                            </div>

                            <button className="w-full bg-blue-400 hover:bg-blue-500 text-gray-800 font-medium py-3 rounded-full transition-all duration-200">
                            Submit
                            </button>
                        </form>
                        
                        <div className="mt-auto text-sm text-left">Have an account? <NavLink to="/"><b>Sign in</b></NavLink></div>
                </div>   
                 <div className="w-full h-full">
                    <img src="/src/assets/img2.png" alt="placeholder" className='pl-5 h-full w-full rounded-4xl'></img>
                 </div>
            </div> 
        </div>
        </>
    );
}

export default Signup ; 
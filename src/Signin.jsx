import { NavLink, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState, useRef, useEffect} from "react";
import api from "./api";
import { useUser } from "/src/hooks/useUser.js";

function Signin() {
    const {setUser, setToken } = useUser();
    const { user, token } = useUser();
    const [hidePassword, setHidePassword] = useState(true);

    function handlePassword() {
        setHidePassword((prev) => (!prev));

    }
    const navigate = useNavigate();

    useEffect(() => {
        if (user && token) {
            navigate("/announcement");
        }
    }, [user, token]);

    const [type, setType] = useState();
    const [response, setResponse] = useState("");
    const responseRef = useRef(null);
    const submitRef = useRef(null);
    const [form , setForm] = useState({
        // student_id: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setForm({ ...form, [e.target.name]: e.target.value });
        
    };  

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        submitRef.current.classList.remove("hidden");
        responseRef.current.classList.add("hidden");
        setResponse("");

        try {
            const res = await api.post("/users/login", form);
            console.log(res);
            console.log(res.data.message);
            setUser(res.data.user);
            setToken(res.data.token);
    
            navigate("/announcement");
        } catch (err) {
            console.log(err);
            const message = err.response?.data?.message || "Network error. Please try againasd.";
            setResponse(message);
            responseRef.current.classList.remove("hidden");
        } 

    };


    return (
    <>
         <div className='w-screen h-screen flex flex-row'>
            <div className="flex flex-col p-4 m-auto rounded-4xl h-150 md:h-150 w-[30vh] md:w-[50vh] lg:w-[60vh] bg-white">
                    <h2 className="text-center text-3xl lg:text-4xl font-bold">Advisory</h2>
                    <p className="pt-5 font-light text-lg">Welcome back. Please sign in.</p>

                    <form onSubmit={handleSubmit} className="pt-5 w-full md:w-100 ml-auto mr-auto">
                        <div className="rounded-lg bg-red-500 p-2 hidden" ref={responseRef}>{response}</div>
                        <div className="text-left pt-3">Email / Student ID</div>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        <div className="text-left pt-5">Password</div>
                        <div className="
                                flex items-center 
                                border border-gray-300 rounded-lg
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
                                className="
                                flex-1 bg-transparent 
                                text-gray-700 
                                border-none 
                                outline-none 
                                placeholder-gray-400
                                "
                                onChange={handleChange}
                                
                            />
                            <button
                                type="button"
                                onClick={handlePassword}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none ml-2"
                            >
                                {hidePassword ? <FaRegEyeSlash  /> : <FaRegEye/>}
                            </button>
                        </div>
                        <div className="text-right pt-5 pb-5 font-light">Forgot your password?</div>
                        <button ref={submitRef} className="w-full flex items-center justify-center gap-2 bg-[#212936] hover:bg-[#697487] text-white font-medium py-3 rounded-lg transition-all duration-200">
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin hidden"></div>
                            <span>Login</span>
                        </button>
                        <NavLink to="./Signup"><div className="text-bottom pt-5">Don't have an account? Sign up</div></NavLink>
                    </form>
            </div> 
        </div>
    
    </>
    );
 }

 export default Signin
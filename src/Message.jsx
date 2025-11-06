import Sidebar from './Sidebar.jsx'; 
import Header from './Header.jsx'

function Message() {
    return(
        <>
            <div className="flex flex-row min-w-screen">
                <div><Sidebar/></div>
                <div className="flex flex-col flex-grow p-4 space-y-6 ml-18 md:ml-42 lg:ml-50">
                    <Header title="Message" buttonType="message"/>
                    <div className="flex flex-col rounded-xl h-150 md:h-60 w-[30vh] md:w-[70vh] lg:w-[100vh] bg-white">
                        asd
                    </div>
                </div>
            </div>
        </>
    );
}

export default Message
import React, { useEffect, useState } from "react";
import api from "./api";


function Userlist() {

     const [users, setUsers] = useState([]);

    useEffect(() => {
      api.get("/users")
        .then(res => {
          setUsers(res.data);
        })
        .catch(err => {
          console.error("Error fetching users:", err);
        });
    }, []);

    //  const users = [
    //     {
    //         id: 1,
    //         username: "test",
    //         email: "test@gmail.com",
    //     }, {
    //         id: 2,
    //         username: "test1",
    //         email: "test1@gmail.com",
    //     },]
    return (
      <>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map(u => (
            <li key={u.id}>{u.username} — {u.email}</li>
          ))}
        </ul>
      </div>
      </>
    );
}
export default Userlist;
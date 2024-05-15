import axios from "axios"
import { useEffect, useState } from "react"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";


export default function User_Table({toggleModel, setIndex, users, setUsers, setCurrent_user, setEdit}){

    async function deleteUser(index){
        try{
            const res = await axios.post(`/api/delete_user`, {
                user_id: users[index].id
            })
            console.log("res.data in del user: ", res.data)
            let temp_users = [...users]
            temp_users.splice(index, 1)
            setUsers(temp_users)
        }
        catch(error){
            console.log("error in delete user: ", error)
        }
    }

    function edituser(index){
        setIndex(index)
        setCurrent_user(users[index])
        setEdit(true)
        toggleModel()
    }

    return(
        <div className="my-5 bg-[#161616]">
            <table className="w-full text-sm">
                <tr>
                    <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Username</th>
                    <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Password</th>
                    <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Level</th>
                    <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Edit</th>
                    <th className="bg-[#1D1D22] font-semibold px-2 py-1.5 border border-[#26262D]">Delete</th>
                </tr>
                {users.map((user, index) => (
                    <tr key={index} className="">
                        <td className="text-center font-light px-2 py-1.5 border border-[#26262D]">{user.username}</td>
                        <td className="text-center font-light px-2 py-1.5 border border-[#26262D] text-ellipsis">{user.password}</td>
                        <td className="text-center font-light px-2 py-1.5 border border-[#26262D]">{user.level}</td>
                        <td className="text-center font-light px-2 py-1.5 border border-[#26262D]"><button onClick={() => edituser(index)}><MdEdit className=""/></button></td>
                        <td className="text-center font-light px-2 py-1.5 border border-[#26262D]"><button onClick={() => deleteUser(index)}><MdDelete className="text-red-600"/></button></td>
                    </tr>
                ))}
            </table>
        </div>
    )
}
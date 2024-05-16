export default function Delete_Pop({del_active, setDel_active, delFunction, message}){
    return(
        <div className="w-screen h-screen inset-0 fixed bg-black/70 text-[#E3E4E8] flex flex-col items-center justify-center">
            <div className="w-2/6 px-7 pt-5 pb-7 rounded flex flex-col space-y-5 justify-center items-center font-poppins bg-[#26262D]">
                <h1 className="text-center font-bold text-sm">{message}</h1>
                <div className="w-full flex flex-row justify-end space-x-5">
                    <button onClick={() => {setDel_active(!del_active)}} type="button" className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]">Cancel</button>
                    <button onClick={() => {delFunction}} className="rounded-sm focus:outline-none hover:bg-[#2D44B7] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs px-6 py-3 text-lg">Delete</button>
                </div>
            </div>
        </div>
    )
}
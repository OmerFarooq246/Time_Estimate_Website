import { useEffect, useState } from "react";
import axios from "axios";

export default function Process_Form({
  toggleModel,
  sub_category,
  processes,
  setProcesses,
  index,
  current_Process,
  edit,
  setEdit,
}) {
  const [processData, setProcessData] = useState(
    edit
      ? current_Process
      : {
          name: "",
          time_per_unit: 0,
          specs: [{ description: "", options: ["", "", "", ""], time_inc: [0, 0, 0, 0]}],
          img_source: "",
        }
  );
  const [file, setFile] = useState(null);
  const [error, setError] = useState({
    name: "",
    time_per_unit: "",
    specs: "",
    img_source: "",
  });
  const [to_del_specs, setTo_del_specs] = useState([])

  function handleChange(event) {
    const { id, value } = event.target;
    setProcessData((prevProcessData) => {
      return { ...prevProcessData, [id]: value };
    });
  }

  function handleFileChange(event) {
    console.log("event.target.files: ", event.target.files);
    setFile(event.target.files[0]);
    setProcessData({
      ...processData,
      ["img_source"]: event.target.files[0].name,
    });
  }

  function giveError() {
    let error = false;
    Object.entries(processData).map(([key, value]) => {
      if (key === "img_source" && value === "" && !edit) {
        error = true;
        setError((prevError) => {
          return { ...prevError, ["img_source"]: `- img not uploaded -` };
        });
      } else if (key === "specs") {
        if (processData.specs.length < 1) {
          error = true;
          setError((prevError) => {
            return { ...prevError, ["specs"]: `- no specs are defined -` };
          });
        } else {
          processData.specs.map((spec) => {
            if (spec.description === "") {
              error = true;
              setError((prevError) => {
                return { ...prevError, ["specs"]: `- description is empty -` };
              });
            }
            if (spec.options.length < 1) {
              error = true;
              setError((prevError) => {
                return {
                  ...prevError,
                  ["specs"]: `- minimum of 1 option should be filled -`,
                };
              });
            } else {
              if (spec.options.includes("")) {
                error = true;
                setError((prevError) => {
                  return { ...prevError, ["specs"]: `- options not filled -` };
                });
              }
            }
          });
        }
      } else if (key === "time_per_unit") {
        if (value === 0) {
          error = true;
          setError((prevError) => {
            return { ...prevError, [key]: `- ${key} can not be zero -` };
          });
        } else if (value === "") {
          error = true;
          setError((prevError) => {
            return { ...prevError, [key]: `- ${key} is empty -` };
          });
        }
      } else if (value === "") {
        error = true;
        setError((prevError) => {
          return { ...prevError, [key]: `- ${key} is empty -` };
        });
      } else {
        error = false;
        setError((prevError) => {
          return { ...prevError, [key]: "" };
        });
      }
    });
    if ((file === "" || file === null || file === undefined) && !edit) {
      error = true;
      setError((prevError) => {
        return { ...prevError, ["img_source"]: `- img not uploaded -` };
      });
    }
    return error;
  }

  function resetError() {
    Object.entries(error).map(([key, value]) => {
      setError((prevError) => {
        return { ...prevError, [key]: "" };
      });
    });
  }

  async function handleFileUpload() {
    console.log("inside fileUpload");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`/api/img_upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("res.data in handlefile uplaod: ", res.data);
      return res.data.secure_url;
    } catch (error) {
      console.log("error in hadnleFileUpload");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    resetError();
    let error_out = giveError();
    console.log("error_out: ", error_out);

    // if(error.name === "" && error.time_per_unit === "" && error.specs === "" && error.img_source === "" && (file !== null || file !== "undefined") ){
    if (!error_out) {
      try {
        console.log("file: ", file);
        console.log("process: ", processData);
        if (edit) {
          let temp_processData = {...processData};

          const res_del = await axios.post("/api/delete_specs", {spec_ids: to_del_specs})
          console.log("res.data in handleDeleteSpec: ", res_del.data)
          
          if (file) {
            const secure_url = await handleFileUpload();
            // let temp_processData = {...processData};
            temp_processData.img_source = secure_url;
            // setProcessData(temp_processData)
          }
          const res = await axios.post(`/api/edit_process`, {
            processData: temp_processData,
          });
          console.log("res.data in edit process: ", res.data);
          let temp_process = [...processes];
          temp_process[index] = res.data;
          setProcesses(temp_process);
          setEdit(false);
        } else {
          const secure_url = await handleFileUpload();
          let temp_processData = {...processData};
          temp_processData.img_source = secure_url;
          
          const res = await axios.post(`/api/add_process`, {
            processData: { ...temp_processData, sub_category },
          });
          console.log("res.data: ", res.data);
          let temp_processes = processes;
          if (Array.isArray(res.data)) {
            temp_processes = [...temp_processes, ...res.data];
          } else {
            temp_processes = [...temp_processes, res.data];
          }
          setProcesses(temp_processes);
        }
        toggleModel();
      } catch (error) {
        console.log("error in creating process: ", error);
        // if (error.response.data.code === "P2002") {
        //   setError((prevError) => {
        //     return { ...prevError, ["name"]: "- Process already registered -" };
        //   });
        // }
      }
    }
  }

  function handleAddOption(index) {
    let specs = processData.specs;
    specs[index].options = [...specs[index].options, ""];
    specs[index].time_inc = [...specs[index].time_inc, 0];
    setProcessData((prevProcessData) => ({...prevProcessData, ["specs"]: specs}))
  }

  function handleDeleteOption(index) {
    let specs = processData.specs;
    specs[index].options.splice(specs[index].options.length - 1, 1);
    specs[index].time_inc.splice(specs[index].time_inc.length - 1, 1);
    setProcessData((prevProcessData) => ({...prevProcessData, ["specs"]: specs}))
  }

  function handleAddSpec() {
    setProcessData((prevProcessData) => ({...prevProcessData, ["specs"]: [...prevProcessData.specs, { description: "", options: ["", "", "", ""], time_inc: [0, 0, 0, 0]}]}))}

  function handleDeleteSpec(index) {
    let specs = processData.specs;
    const id = specs[index].id
    if(id){
      console.log("index: ", index)
      console.log("id: ", id)
      console.log("specs: ", specs)
      setTo_del_specs((prevIds) => ([...prevIds, id]))
    }
    specs.splice(index, 1);
    setProcessData((prevProcessData) => ({...prevProcessData, ["specs"]: specs}))
  }

  function handleDescriptionChange(event, index) {
    console.log("value: ", event.target.value);
    let specs = processData.specs;
    specs[index].description = event.target.value;
    console.log("specs: ", specs);
    setProcessData((prevProcessData) => ({
      ...prevProcessData,
      ["specs"]: specs,
    }));
  }

  function handleOptionChange(event, index, index_2) {
    console.log("option id: ", event.target.id);
    console.log("option value: ", event.target.value);
    let specs = processData.specs;
    specs[index].options[index_2] = event.target.value;
    setProcessData((prevProcessData) => ({
      ...prevProcessData,
      ["specs"]: specs,
    }));
  }

  function handleTime_Inc_Change(event, index, index_2){
    let specs = processData.specs
    specs[index].time_inc[index_2] = event.target.value
    setProcessData((prevProcessData) => ({...prevProcessData, ["specs"]: specs}))
  }

  function cancelForm(){
    setEdit(false)
    toggleModel()
  }

  return (
    <div className="w-screen h-screen inset-0 fixed bg-black/70 text-[#E3E4E8] dark:text-[#17181C] flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-4/6 h-5/6 overflow-y-scroll overscroll-contain scrollbar scrollbar-thumb-[#26262D] scrollbar-track-[#1D1D22] dark:scrollbar-thumb-[#F0F2FF] scrollbar-track-[#F7F9FC] rounded flex flex-col justify-center items-center font-poppins bg-[#26262D] dark:bg-[#F7F9FC]"
      >
        <div className="w-full h-full px-7 pt-5 pb-7 flex flex-col">
          <div className="w-full flex flex-col space-y-2.5 mb-4">
            <label htmlFor="name" className="text-xs">
              Process Name
            </label>
            <input
              value={processData.name}
              onChange={handleChange}
              type="text"
              id="name"
              className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"
            />
          </div>
          {/* <div className="w-full flex flex-col space-y-2.5 mb-4">
            <label htmlFor="time_per_unit" className="text-xs">
              Time per Unit (in minutes)
            </label>
            <input
              value={processData.time_per_unit}
              onChange={handleChange}
              type="number"
              min="0"
              id="time_per_unit"
              className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"
            />
          </div> */}
          {processData.specs.map((spec, index) => (
            <div
              key={index}
              className="w-full flex flex-col space-y-2.5 mb-3 rounded"
            >
              <h1 className="text-xs">{`spec_${index + 1}`}</h1>
              <div className="bg-[#31313A] dark:bg-[#F0F2FF] space-y-2.5 py-3 px-3 flex flex-col items-start">
                <label
                  htmlFor={`spec_${index + 1}_description`}
                  className="text-xs pl-0.5"
                >
                  Description
                </label>
                <input
                  value={processData.specs[index].description}
                  onChange={(event) => handleDescriptionChange(event, index)}
                  type="text"
                  id={`spec_${index + 1}_description`}
                  className="px-3 py-2 bg-[#3A3A43] dark:bg-[#E0E6FF] text-sm rounded-sm focus:outline-none w-full"
                />
                <p className="text-xs pl-0.5">Options and Time</p>
                <div className="bg-[#31313A] dark:bg-[#F0F2FF] grid grid-cols-4 gap-x-2.5 gap-y-2.5">
                  {spec.options.map((option, index_2) => (
                    <div key={index_2} className="">
                      <input
                        value={option}
                        onChange={(event) =>
                          handleOptionChange(event, index, index_2)
                        }
                        type="text"
                        id={`spec_${index + 1}_option_${index_2 + 1}`}
                        className="px-3 py-2 bg-[#3A3A43] dark:bg-[#E0E6FF] text-sm rounded-sm focus:outline-none w-full"
                      />
                      <div className="w-full flex items-center justify-center py-1">
                        <input value={processData?.specs[index].time_inc[index_2]} onChange={(event) => handleTime_Inc_Change(event, index, index_2)} type="float" min={0} className="py-1 px-2 bg-[#3A3A43] dark:bg-[#E0E6FF] text-xs rounded-sm focus:outline-none w-full"/>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-row w-full space-x-5 justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteSpec(index)}
                    className="text-xs text-[#FA450C] px-2 hover:text-[#de3705] focus:text-[#de3705]"
                  >
                    Delete Spec
                  </button>
                  <div className="flex flex-row space-x-5 justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(index)}
                      className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]"
                    >
                      Delete Option
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddOption(index)}
                      className="rounded-sm px-5 py-2 text-xs hover:bg-[#2D44B7] dark:text-[#F9FAFF] focus:bg-[#2D44B7] bg-[#3E5EFF]"
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSpec}
            className="w-fit mb-4 self-start rounded-sm px-5 py-2 text-xs hover:bg-[#2D44B7] dark:text-[#F9FAFF] focus:bg-[#2D44B7] bg-[#3E5EFF]"
          >
            Add Spec
          </button>
          <div className="w-full flex flex-col space-y-2.5 mb-2">
            <label htmlFor="img" className="text-xs">
              Image
            </label>
            {edit && !file && (
              <p className="text-xs">{processData.img_source}</p>
            )}
            <input
              onChange={handleFileChange}
              type="file"
              id="img"
              name="img"
              accept=".jpg"
              className="px-3 py-2 bg-[#31313A] dark:bg-[#F0F2FF] text-sm rounded-sm focus:outline-none"
            />
          </div>
          <div className="w-full flex flex-col space-y-1 mb-7">
            {error.name !== "" && (
              <p className="text-xs text-orange-700 mt-0.5">{error.name}</p>
            )}
            {error.time_per_unit !== "" && (
              <p className="text-xs text-orange-700 mt-0.5">
                {error.time_per_unit}
              </p>
            )}
            {error.img_source !== "" && (
              <p className="text-xs text-orange-700 mt-0.5">
                {error.img_source}
              </p>
            )}
            {error.specs !== "" && (
              <p className="text-xs text-orange-700 mt-0.5">{error.specs}</p>
            )}
          </div>
          <div className="w-full pb-7 flex flex-row space-x-5 justify-end">
            <button
              onClick={cancelForm}
              type="button"
              className="text-xs text-[#FA450C] hover:text-[#de3705] focus:text-[#de3705]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-sm focus:outline-none hover:bg-[#2D44B7] dark:text-[#F9FAFF] focus:bg-[#2D44B7] bg-[#3E5EFF] text-xs px-8 py-3 text-lg"
            >
              {edit ? "Edit" : "Add"} Process
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

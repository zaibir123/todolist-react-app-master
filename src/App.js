import "./App.css";
import List from "./List";
import { useState, useEffect } from "react";
import { uid } from "uid";
import axios from "axios";

let api = axios.create({ baseURL: "http://localhost:3000" });

function App() {
  const [contacts, setContacts] = useState([]);

  const [isUpdate, setIsUpdate] = useState({ id: null, status: false });

  const [formData, setFormData] = useState({
    name: ""
  });

  useEffect(() => {
  

    api.get("/contacts").then((res) => {
      setContacts(res.data);
    });
  }, []);

  function handleChange(e) {
    let newFormState = { ...formData };
    newFormState[e.target.name] = e.target.value;
    setFormData(newFormState);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let data = [...contacts];

    if (formData.name === "") {
      return false;
    }

    if (isUpdate.status) {
      data.forEach((contact) => {
        if (contact.id === isUpdate.id) {
          contact.name = formData.name;
         
        }
      });
      api
        .put("/contacts/" + isUpdate.id, {
          id: isUpdate.id,
          name: formData.name,
         
        })
        .then(() => {
          alert("Data berhasil di update");
        });
   
    } else {
      let toSave = {
        id: uid(),
        name: formData.name,
      };
      data.push(toSave);

 
      api.post("/contacts", toSave).then(() => {
        alert("Data berhasil ditambah");
      });
    }
    setContacts(data);
    setIsUpdate(false);
    setFormData({ name: ""});
  }

  function handleEdit(id) {
   
    let data = [...contacts];
    let foundData = data.find((contact) => contact.id === id);
    setIsUpdate({ status: true, id: id });
    setFormData({ name: foundData.name });  
  }

  function handleDelete(id) {
    let data = [...contacts];
    let filteredData = data.filter((contact) => contact.id !== id);

   
    api.delete("/contacts/" + id).then(() => alert("Data berhasil dihapus"));
    setContacts(filteredData);
  }

  return (
    <div className="App">
      <div className="fixed-top bg-white pb-3 mx-auto" style={{ width: 400 }}>
        <h1 className="px-3 py-3 font-weight-bold">Project To Do List</h1>
        <form onSubmit={handleSubmit} className="px-3 py-4">
          <div className="form-group">
            <label htmlFor="">Create To Do</label>
            <input
              type="text"
              onChange={handleChange}
              className="form-control"
              value={formData.name}
              name="name"
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Save
            </button>
          </div>
        </form>
      </div>
      <div style={{ marginTop: 350 }}>
        <List
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          data={contacts}
        />
      </div>
    </div>
  );
}

export default App;

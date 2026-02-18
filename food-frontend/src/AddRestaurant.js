import { useState } from "react";
import axios from "axios";

function AddRestaurant(){

  const user = JSON.parse(localStorage.getItem("user"));

  const [rest,setRest] = useState({
    name:"",
    description:"",
    address:"",
    city:""
  });

  const submit = async e =>{
  e.preventDefault();

  await axios.post(
    `http://localhost:8080/api/restaurants/add/${user.id}`,
    rest
  );

  alert("Restaurant added!");
  window.location.reload(); // quick refresh
};

  return(
    <form onSubmit={submit}>
      <h2>Add Restaurant</h2>

      <input placeholder="Name"
        onChange={e=>setRest({...rest,name:e.target.value})}/>

      <input placeholder="Description"
        onChange={e=>setRest({...rest,description:e.target.value})}/>

      <input placeholder="Address"
        onChange={e=>setRest({...rest,address:e.target.value})}/>

      <input placeholder="City"
        onChange={e=>setRest({...rest,city:e.target.value})}/>

      <button>Add</button>
    </form>
  );
}

export default AddRestaurant;

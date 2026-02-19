import { useState } from "react";
import axios from "axios";

function AddDish({restaurantId}){

  const [dish,setDish] = useState({
    name:"",
    description:"",
    price:""
  });

  const submit = async e =>{
    e.preventDefault();

    await axios.post(
      `http://localhost:8080/api/dishes/add/${restaurantId}`,
      dish
    );

    alert("Dish added!");
  };

  return(
    <form onSubmit={submit}>
      

      <input placeholder="Name"
        onChange={e=>setDish({...dish,name:e.target.value})}/>

      <input placeholder="Description"
        onChange={e=>setDish({...dish,description:e.target.value})}/>

      <input placeholder="Price"
        onChange={e=>setDish({...dish,price:e.target.value})}/>

      <button>Add Dish</button>
    </form>
  );
}

export default AddDish;

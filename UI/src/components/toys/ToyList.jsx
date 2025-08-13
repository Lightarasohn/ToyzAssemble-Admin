import { useEffect, useState } from "react";
import GetAllToysAPI from "../../api/toys/GetAllToysAPI";

const ToyList = () => {
    const [toys, setToys] = useState([]);

    useEffect(()=>{
        const fetchToys = async () => {
            const data = await GetAllToysAPI();
            setToys(data);
        }
        fetchToys();
    },[]);

    useEffect(() => {
        console.log("Toy list:", toys);
    },[toys]);

    return(
        <div>
            <h1>Toy List Component</h1>
        </div>
    );
}

export default ToyList;
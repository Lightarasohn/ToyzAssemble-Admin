import { useEffect, useState } from "react";
import ToyList from "./ToyList";
import { Card, Tag } from "antd";
import ToyCheckedList from "./ToyCheckedList";

const ToyMainPage = () => {
  const [selectedToys, setSelectedToys] = useState([]);

  const handleSelection = (item) => {
    if (selectedToys.includes(item)) {
      setSelectedToys(selectedToys.filter((x) => x.id !== item.id));
    } else {
      setSelectedToys([...selectedToys, item]);
    }
  };

  useEffect(() => {
    console.log("selectedToys:", selectedToys);
  }, [selectedToys]);

  return (
    <div 
      style={{
        display:"flex",
        flexDirection:"column",
        gap:"16px"
      }}
    >
      {selectedToys.length ?
        <ToyCheckedList 
          selectedToys={selectedToys} 
          handleSelection={handleSelection} 
          clearSelection={() => setSelectedToys([])} 
        />
        : null}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
        }}
      >
        <ToyList 
            handleSelection={handleSelection}
            selectedToys={selectedToys}    
        ></ToyList>
      </div>
    </div>
  );
};

export default ToyMainPage;

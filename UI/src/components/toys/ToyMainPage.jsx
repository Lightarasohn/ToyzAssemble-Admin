import { useEffect, useState } from "react";
import ToyList from "./ToyList";
import { Card, Tag } from "antd";
import ToyCheckedList from "./ToyCheckedList";
import ToyCheckedCard from "./ToyCheckedCard";

const ToyMainPage = () => {
  const [selectedToys, setSelectedToys] = useState([]);
  const [isFetchList, setIsFetchList] = useState(true);

  const handleSelection = (item) => {
    if (selectedToys.includes(item)) {
      setSelectedToys(selectedToys.filter((x) => x.id !== item.id));
    } else {
      setSelectedToys([...selectedToys, item]);
    }
  };

  return (
    <div 
      style={{
        display:"flex",
        flexDirection:"column",
        gap:"16px"
      }}
    >
      {selectedToys.length ?
        <ToyCheckedCard 
          selectedToys={selectedToys} 
          handleSelection={handleSelection} 
          clearSelection={() => setSelectedToys([])}
          isFetchList={isFetchList}
          setIsFetchList={setIsFetchList}
          setSelectedToys={setSelectedToys}
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
            isFetchList={isFetchList}
            setIsFetchList={setIsFetchList}
        ></ToyList>
      </div>
    </div>
  );
};

export default ToyMainPage;

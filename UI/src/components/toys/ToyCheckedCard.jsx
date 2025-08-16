import { Card, Tag, Button } from "antd";
import ToyCheckedForm from "./ToyCheckedForm";
import Title from "antd/es/typography/Title";
import ToyCheckedList from "./ToyCheckedList";

const ToyCheckedCard = ({ selectedToys, setSelectedToys, handleSelection, clearSelection, setIsFetchList }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignContent: "center",
        gap: "16px"
      }}
    >
      <Card
        style={{ display: "flex", flexDirection: "column", flex: 3, gap: "8px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={3} style={{ margin: 0 }}>Selected Toys</Title>
          <Button size="small" onClick={clearSelection}>Clear All</Button>
        </div>
        <ToyCheckedList selectedToys={selectedToys} handleSelection={handleSelection}></ToyCheckedList>
      </Card>
      <Card
        style={{ display: "flex", flexDirection: "column", flex: 2 }}
      >
        <Title level={3}>Update Form</Title>
        <ToyCheckedForm selectedToys={selectedToys} setIsFetchList={setIsFetchList} setSelectedToys={setSelectedToys} />
      </Card>
    </div>
  );
};

export default ToyCheckedCard;

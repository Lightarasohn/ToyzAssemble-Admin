import { Card, Tag, Button } from "antd";
import ToyCheckedForm from "./ToyCheckedForm";
import Title from "antd/es/typography/Title";

const ToyCheckedList = ({ selectedToys, handleSelection, clearSelection }) => {
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {selectedToys.map((item) => (
            <Tag
              key={item.id}
              closable
              onClose={() => handleSelection(item)}
            >
              {item.name} | ${item.price} | {item.luckPercentage}% | {item.rarity.name} | {item.toyType.name}
            </Tag>
          ))}
        </div>
      </Card>
      <Card
        style={{ display: "flex", flexDirection: "column", flex: 2 }}
      >
        <Title level={3}>Update Form</Title>
        <ToyCheckedForm />
      </Card>
    </div>
  );
};

export default ToyCheckedList;

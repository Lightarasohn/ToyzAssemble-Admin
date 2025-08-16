import { Card, Tag, Button } from "antd";
import ToyCheckedForm from "./ToyCheckedForm";
import Title from "antd/es/typography/Title";

const ToyCheckedList = ({ selectedToys, handleSelection}) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {selectedToys.map((item) => (
        <Tag key={item.id} closable onClose={() => handleSelection(item)}>
          {item.name} | ${item.price} | {item.luckPercentage}% |{" "}
          {item.rarity.name} | {item.toyType.name}
        </Tag>
      ))}
    </div>
  );
};

export default ToyCheckedList;

import { Button, Card, Form, Input, InputNumber, Select } from "antd";

const ToyCheckedForm = () => {
  
  const handleFinish = (val) => {
    console.log(val);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      style={{ display: "flex", flexDirection: "column", gap: "0px" }}
    >
      {/* Price ve Luck Percentage */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item
          label="Price"
          name="price"
          style={{ flex: 1 }}
        >
          <InputNumber
            addonBefore="$"
            addonAfter="float"
            min={0}
            placeholder="10.10"
            onChange={(e) => console.log(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Luck Percentage"
          name="luckPercentage"
          style={{ flex: 1 }}
        >
          <InputNumber
            addonBefore="%"
            addonAfter="float"
            min={0}
            max={100}
            placeholder="10.10"
            onChange={(e) => console.log(e.target.value)}
          />
        </Form.Item>
      </div>

      {/* Rarity ve Toy Type */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item
          label="Rarity"
          name="rarity"
          style={{ flex: 1 }}
        >
          <Select
            placeholder="Rare, Common, Epic..."
            options={[]}
            onChange={(e) => console.log(e)}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="Toy Type"
          name="toyType"
          style={{ flex: 1 }}
        >
          <Select
            placeholder="Classic Guys, Icon Guys, Pets..."
            options={[]}
            onChange={(e) => console.log(e)}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </div>

      <Button htmlType="submit" type="primary">
        Update Selected Toys
      </Button>
    </Form>
  );
};

export default ToyCheckedForm;

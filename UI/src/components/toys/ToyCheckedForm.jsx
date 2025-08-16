import { Button, Card, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import GetAllRarityTypesAPI from "../../api/rarityType/GetAllRarityTypesAPI";
import GetAllToyTypesAPI from "../../api/toyType/GetAllToyTypesAPI";
import UpdateSelectedToysAPI from "../../api/toyService/UpdateSelectedToysAPI";
import { useNotification } from "../../services/NotificationService";

const ToyCheckedForm = ({ selectedToys, setIsFetchList, setSelectedToys }) => {
  const [rarityTypes, setRarityTypes] = useState([]);
  const [toyTypes, setToyTypes] = useState([]);
  const notification = useNotification();

  const handleFinish = async (val) => {
    const normalizedVal = Object.fromEntries(
      Object.entries(val).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    );
    const apiVal = {
      idList: selectedToys.map((x) => x.id),
      updateDto: normalizedVal,
    };
    console.log(apiVal);
    try {
      await UpdateSelectedToysAPI(apiVal);
      setIsFetchList(true);
      setSelectedToys([]);
      notification.success({
        message: "Success",
        description: "Selected toys updated successfully!",
        duration: 5, // saniye cinsinden
        showProgress: true, // progress bar göster
        pauseOnHover: true, // hover'da duraklat
        placement: "topRight", // konum (isteğe bağlı)
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Selectod toys could not be updated!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
    }
  };

  useEffect(() => {
    const fetchRarityTypes = async () => {
      try {
        const fetchedRarityTypes = await GetAllRarityTypesAPI();
        setRarityTypes(
          fetchedRarityTypes.map((rt) => {
            return {
              value: rt.id,
              label: rt.name,
              object: rt,
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    const fetchToyTypes = async () => {
      try {
        const fetchedToyTypes = await GetAllToyTypesAPI();
        setToyTypes(
          fetchedToyTypes.map((tt) => {
            return {
              value: tt.id,
              label: tt.name,
              object: tt,
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchRarityTypes();
    fetchToyTypes();
  }, []);

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      style={{ display: "flex", flexDirection: "column", gap: "0px" }}
    >
      {/* Price ve Luck Percentage */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item label="Price" name="price" style={{ flex: 1 }}>
          <InputNumber
            addonBefore="$"
            addonAfter="float"
            min={0}
            placeholder="10.10"
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
          />
        </Form.Item>
      </div>

      {/* Rarity ve Toy Type */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Form.Item label="Rarity" name="rarityTypeId" style={{ flex: 1 }}>
          <Select
            placeholder="Rare, Common, Epic..."
            options={rarityTypes}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
        </Form.Item>

        <Form.Item label="Toy Type" name="toyTypeId" style={{ flex: 1 }}>
          <Select
            placeholder="Classic Guys, Icon Guys, Pets..."
            options={toyTypes}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
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

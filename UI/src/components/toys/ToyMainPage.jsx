import { use, useEffect, useState } from "react";
import ToyList from "./ToyList";
import ReusableCheckedCard from "../../reusableComponents/ReusableCheckedCard";
import GetAllToyTypesAPI from "../../api/toyType/GetAllToyTypesAPI";
import GetAllRarityTypesAPI from "../../api/rarityType/GetAllRarityTypesAPI";
import { useNotification } from "../../services/NotificationService";
import UpdateSelectedToysAPI from "../../api/toyService/UpdateSelectedToysAPI";
import {
  Button,
  Card,
  Carousel,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import UpdateToyAPI from "../../api/toy/UpdateToyAPI";
import AddToyAPI from "../../api/toy/AddToyAPI";
import DeleteToyAPI from "../../api/toy/DeleteToyAPI";
import ToyEditAddCard from "./ToyEditAddCard";

const ToyMainPage = () => {
  const [toys, setToys] = useState([]);
  const [selectedToys, setSelectedToys] = useState([]);
  const [isFetchList, setIsFetchList] = useState(true);
  const [rarityTypes, setRarityTypes] = useState([]);
  const [toyTypes, setToyTypes] = useState([]);
  const [editingToy, setEditingToy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const notification = useNotification();
  const [form] = Form.useForm(); // This form will be shared with ToyEditAddCard

  const handleEditButton = (record) => {
    if (record === null) {
      // Kapatma işlemi
      setEditingToy(null);
      setIsEditing(false);
      form.resetFields();
    } else {
      // Edit moduna geçiş
      setEditingToy(record);
      setIsEditing(true);

      // Form değerlerini set et
      form.setFieldsValue({
        name: record.name,
        price: record.price,
        toyTypeId: record.toyTypeId,
        luckPercentage: record.luckPercentage,
        rarityId: record.rarityId,
      });
    }
  };

  const formFields = [
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "10.10",
      min: 0,
      max: 100,
      addOnBefore: "$",
      addOnAfter: "float",
      flex: 1,
    },
    {
      name: "luckPercentage",
      label: "Luck Percentage",
      type: "number",
      placeholder: "0.42",
      min: 0,
      max: 100,
      addOnBefore: "%",
      addOnAfter: "float",
      flex: 1,
    },
    {
      name: "rarityTypeId",
      label: "Rarity",
      type: "select",
      placeholder: "Common, Rare, Epic...",
      flex: 1,
      selectKey: "rarityTypes",
    },
    {
      name: "toyTypeId",
      label: "Toy Type",
      type: "select",
      placeholder: "Classic, Special, Accessory...",
      flex: 1,
      selectKey: "toyTypes",
    },
  ];

  const normalizeCheckFormValues = (val) => {
    return Object.fromEntries(
      Object.entries(val).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    );
  };

  const handleCheckFinish = async (val) => {
    const normalizedVal = normalizeCheckFormValues(val);
    const apiVal = {
      idList: selectedToys.map((x) => x.id),
      updateDto: normalizedVal,
    };
    try {
      await UpdateSelectedToysAPI(apiVal);
      setIsFetchList(true);
      setSelectedToys([]);
      notification.success({
        message: "Success",
        description: "Selected toys updated successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Selected toys could not be updated!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
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

  const handleSelection = (item) => {
    if (selectedToys.includes(item)) {
      setSelectedToys(selectedToys.filter((x) => x.id !== item.id));
    } else {
      setSelectedToys([...selectedToys, item]);
    }
  };

  const clearSelection = () => {
    setSelectedToys([]);
  };

  const handleDeleteButton = async (record) => {
    try {
      await DeleteToyAPI(record.id);
      setIsFetchList(true);
      // Edit edilen oyuncak silinirse edit modundan çık
      if (editingToy && editingToy.id === record.id) {
        handleEditButton(null);
      }
      notification.success({
        message: "Success",
        description: "Toy deleted successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Toy could not be deleted!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {selectedToys.length ? (
        <>
          <ReusableCheckedCard
            selectedItems={selectedToys}
            handleSelection={handleSelection}
            clearSelection={clearSelection}
            handleFinish={handleCheckFinish}
            title={`Selected Toys`}
            updateButtonText="Update Selected Toys"
            clearButtonText="Clear All"
            updateFormTitle="Update Form"
            formFields={formFields}
            selectOptions={{
              rarityTypes: rarityTypes,
              toyTypes: toyTypes,
            }}
            leftCardFlex={3}
            rightCardFlex={2}
            showUpdateForm={true}
            itemDisplayFunction={(toy) =>
              `${toy.name} | $${toy.price} | ${toy.rarity.name} | ${toy.toyType.name}`
            }
          />
        </>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
          gap: "16px",
        }}
      >
        <ToyList
          handleSelection={handleSelection}
          selectedToys={selectedToys}
          setSelectedToys={setSelectedToys}
          isFetchList={isFetchList}
          setIsFetchList={setIsFetchList}
          toys={toys}
          setToys={setToys}
          handleEdit={handleEditButton}
          handleDeleteButton={handleDeleteButton}
        />

        {/* Edit/Add Card - Pass the form instance */}
        <ToyEditAddCard
          form={form} // Pass the shared form instance
          editingToy={editingToy}
          toyTypes={toyTypes}
          rarityTypes={rarityTypes}
          handleEditButton={handleEditButton}
          isEditing={isEditing}
          setEditingToy={setEditingToy}
          setIsEditing={setIsEditing}
          setIsFetchList={setIsFetchList}
        />
      </div>
    </div>
  );
};

export default ToyMainPage;
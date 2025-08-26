import { useState } from "react";
import ReusableEditAddCard from "../../reusableComponents/ReusableEditAddCard";
import { Form } from "antd";
import { useNotification } from "../../services/NotificationService";
import ReusableDeleteModal from "../../reusableComponents/ReusableDeleteModal";
import RarityList from "./RarityList";
import AddRarityTypeAPI from "../../api/rarityType/AddRarityTypeAPI";
import UpdateRarityTypeAPI from "../../api/rarityType/UpdateRarityTypeAPI";
import DeleteRarityTypeAPI from "../../api/rarityType/DeleteRarityTypeAPI";

const RarityMainPage = () => {
  const [rarities, setRarities] = useState([]);
  const [isFetchList, setIsFetchList] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState([false, null]);
  const notification = useNotification();
  const [form] = Form.useForm();

  const handleEditButton = (record) => {
    if (record === null) {
      // Close operation
      setEditingItem(null);
      setIsEditing(false);
      form.resetFields();
    } else {
      // Switch to edit mode
      setEditingItem(record);
      setIsEditing(true);

      // Set form values
      form.setFieldsValue({
        name: record.name,
      });
    }
  };

  // Form fields for the Edit/Add card
  const editAddFormFields = [
    {
      name: "name",
      label: "Name",
      type: "input",
      placeholder: "Enter rarity name",
      required: true,
      flex: 3,
    },
  ];

  const handleDelete = async (record) => {
    try {
      await DeleteRarityTypeAPI(record.id);
      setIsFetchList(true);
      // If the editing toy is deleted, exit edit mode
      if (editingItem && editingItem.id === record.id) {
        handleEditButton(null);
      }
      notification.success({
        message: "Success",
        description: "Rarity Type deleted successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Rarity Type could not be deleted!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  };

  const handleDeleteButton = (record) => {
    setIsDeleteModalOpen([true, record]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flex:1
          }}
        >
          <RarityList
            isFetchList={isFetchList}
            setIsFetchList={setIsFetchList}
            rarities={rarities}
            handleEdit={handleEditButton}
            handleDeleteButton={handleDeleteButton}
            setRarities={setRarities}
          />
          <ReusableDeleteModal
            isOpen={isDeleteModalOpen}
            setIsOpen={setIsDeleteModalOpen}
            record={isDeleteModalOpen[1]}
            handleOk={handleDelete}
          />
        </div>

        {/* Using the new ReusableEditAddCard */}
        <div
        style={{
          display:"flex",
          flex:1
        }}
        >
          <ReusableEditAddCard
            form={form}
            editingItem={editingItem}
            isEditing={isEditing}
            onAdd={AddRarityTypeAPI}
            onUpdate={UpdateRarityTypeAPI}
            onClose={() => handleEditButton(null)}
            setIsFetchList={setIsFetchList}
            entityName="RarityType"
            formFields={editAddFormFields}
            showImages={false}
            imageUrlsKey=""
            noImagesText="No Images Available"
            showIdCard={true}
            fieldsPerRow={3}
            messages={{
              addSuccess: "Rarity Type added successfully!",
              addError: "Rarity Type could not be added!",
              updateSuccess: "Rarity Type updated successfully!",
              updateError: "Rarity Type could not be updated!",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RarityMainPage;

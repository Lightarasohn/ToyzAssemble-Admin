import { useState } from "react";
import ReusableEditAddCard from "../../reusableComponents/ReusableEditAddCard";
import { Form } from "antd";
import { useNotification } from "../../services/NotificationService";
import ReusableDeleteModal from "../../reusableComponents/ReusableDeleteModal";
import DeleteToyTypeAPI from "../../api/toyType/DeleteToyTypeAPI";
import AddToyTypeAPI from "../../api/toyType/AddToyTypeAPI";
import UpdateToyTypeAPI from "../../api/toyType/UpdateToyTypeAPI";
import ToyTypeList from "./ToyTypeList";

const ToyTypeMainPage = () => {
  const [toyTypes, setToyTypes] = useState([]);
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
      placeholder: "Enter toy type name",
      required: true,
      flex: 3,
    },
  ];

  const handleDelete = async (record) => {
    try {
      await DeleteToyTypeAPI(record.id);
      setIsFetchList(true);
      // If the editing toy is deleted, exit edit mode
      if (editingItem && editingItem.id === record.id) {
        handleEditButton(null);
      }
      notification.success({
        message: "Success",
        description: "Toy Type deleted successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Toy Type could not be deleted!",
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
          <ToyTypeList
            isFetchList={isFetchList}
            setIsFetchList={setIsFetchList}
            toyTypes={toyTypes}
            handleEdit={handleEditButton}
            handleDeleteButton={handleDeleteButton}
            setToyTypes={setToyTypes}
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
            onAdd={AddToyTypeAPI}
            onUpdate={UpdateToyTypeAPI}
            onClose={() => handleEditButton(null)}
            setIsFetchList={setIsFetchList}
            entityName="ToyType"
            formFields={editAddFormFields}
            showImages={false}
            imageUrlsKey=""
            noImagesText="No Images Available"
            showIdCard={true}
            fieldsPerRow={3}
            messages={{
              addSuccess: "Toy Type added successfully!",
              addError: "Toy Type could not be added!",
              updateSuccess: "Toy Type updated successfully!",
              updateError: "Toy Type could not be updated!",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToyTypeMainPage;

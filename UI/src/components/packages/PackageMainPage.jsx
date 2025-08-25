import { useState } from "react";
import ReusableCheckedCard from "../../reusableComponents/ReusableCheckedCard";
import ReusableEditAddCard from "../../reusableComponents/ReusableEditAddCard";
import { Form } from "antd";
import { useNotification } from "../../services/NotificationService";
import PackageList from "./PackageList";
import DeletePackageAPI from "../../api/package/DeletePackageAPI";
import UpdateSelectedPackagesAPI from "../../api/package/UpdateSelectedPackagesAPI";
import AddPackageAPI from "../../api/package/AddPackageAPI";
import UpdatePackageAPI from "../../api/package/UpdatePackageAPI";
import ReusableDeleteModal from "../../reusableComponents/ReusableDeleteModal";

const PackageMainPage = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
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
        price: record.price
      });
    }
  };

  // Form fields configuration for both ReusableCheckedCard and ReusableEditAddCard
  const bulkUpdateFormFields = [
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
  ];

  // Form fields for the Edit/Add card
  const editAddFormFields = [
    {
      name: "name",
      label: "Name",
      type: "input",
      placeholder: "Enter package name",
      required: true,
      flex: 3,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "0.00",
      min: 0,
      max: 1000,
      addOnBefore: "$",
      addOnAfter: "float",
      required: true,
      flex: 1,
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
      idList: selectedPackages.map((x) => x.id),
      updateDto: normalizedVal,
    };
    try {
      await UpdateSelectedPackagesAPI(apiVal);
      setIsFetchList(true);
      setSelectedPackages([]);
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

  const handleSelection = (item) => {
    if (selectedPackages.includes(item)) {
      setSelectedPackages(selectedPackages.filter((x) => x.id !== item.id));
    } else {
      setSelectedPackages([...selectedPackages, item]);
    }
  };

  const clearSelection = () => {
    setSelectedPackages([]);
  };

  const handleDelete = async (record) => {
    try {
      await DeletePackageAPI(record.id);
      setIsFetchList(true);
      // If the editing toy is deleted, exit edit mode
      if (editingItem && editingItem.id === record.id) {
        handleEditButton(null);
      }
      notification.success({
        message: "Success",
        description: "Package deleted successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Package could not be deleted!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  }

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
      {selectedPackages.length ? (
        <>
          <ReusableCheckedCard
            selectedItems={selectedPackages}
            handleSelection={handleSelection}
            clearSelection={clearSelection}
            handleFinish={handleCheckFinish}
            title={`Selected Packages`}
            updateButtonText="Update Selected Packages"
            clearButtonText="Clear All"
            updateFormTitle="Update Form"
            formFields={bulkUpdateFormFields}
            leftCardFlex={3}
            rightCardFlex={2}
            showUpdateForm={true}
            itemDisplayFunction={(item) =>
              `${item.name} | $${item.price}`
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
        <PackageList
          handleSelection={handleSelection}
          selectedPackages={selectedPackages}
          setSelectedPackages={setSelectedPackages}
          isFetchList={isFetchList}
          setIsFetchList={setIsFetchList}
          packages={packages}
          setPackages={setPackages}
          handleEdit={handleEditButton}
          handleDeleteButton={handleDeleteButton}
        />
        <ReusableDeleteModal 
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          record={isDeleteModalOpen[1]}
          handleOk={handleDelete}
        />

        {/* Using the new ReusableEditAddCard */}
        <ReusableEditAddCard
          form={form}
          editingItem={editingItem}
          isEditing={isEditing}
          onAdd={AddPackageAPI}
          onUpdate={UpdatePackageAPI}
          onClose={() => handleEditButton(null)}
          setIsFetchList={setIsFetchList}
          entityName="Package"
          formFields={editAddFormFields}
          showImages={false}
          imageUrlsKey=""
          noImagesText="No Images Available"
          showIdCard={true}
          fieldsPerRow={3}
          messages={{
            addSuccess: "Package added successfully!",
            addError: "Package could not be added!",
            updateSuccess: "Package updated successfully!",
            updateError: "Package could not be updated!",
          }}
        />
      </div>
    </div>
  );
};

export default PackageMainPage;
import { use, useEffect, useState } from "react";
import ReusableCheckedCard from "../../reusableComponents/ReusableCheckedCard";
import ReusableEditAddCard from "../../reusableComponents/ReusableEditAddCard";
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
import { useNotification } from "../../services/NotificationService";
import ReusableDeleteModal from "../../reusableComponents/ReusableDeleteModal";
import GetAllPackagesAPI from "../../api/package/GetAllPackagesAPI";
import DeletePackageAPI from "../../api/package/DeletePackageAPI";
import DeletePackageRarityAPI from "../../api/package-rarity/DeletePackageRarityAPI";
import AddPackageRarityAPI from "../../api/package-rarity/AddPackageRarityAPI";
import UpdatePackageRarityAPI from "../../api/package-rarity/UpdatePackageRarityAPI";
import PackagesRaritiesList from "./PackagesRaritiesList";
import GetAllRarityTypesAPI from "../../api/rarityType/GetAllRarityTypesAPI";

const PackagesRaritiesMainPage = () => {
  const [packagesRarities, setPackagesRarities] = useState([]);
  const [selectedPackagesRarities, setSelectedPackagesRarities] = useState([]);
  const [isFetchList, setIsFetchList] = useState(true);
  const [rarityTypes, setRarityTypes] = useState([]);
  const [packages, setPackages] = useState([]);
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
        packageId: record.packageId,
        rarityTypeId: record.rarityTypeId,
        ratio: record.ratio
      });
    }
  };

  // Form fields configuration for both ReusableCheckedCard and ReusableEditAddCard
  const bulkUpdateFormFields = [
    {
      name: "ratio",
      label: "Ratio",
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
        name: "packageId",
        label: "Package",
        type: "select",
        placeholder: "Select Package",
        selectKey: "packages",
        required: true,
        flex: 1
    },
    {
        name: "rarityTypeId",
        label: "Rarity",
        type: "select",
        placeholder: "Select Rarity",
        selectKey: "rarityTypes",
        required: true,
        flex: 1
    },
    {
        name: "ratio",
        label: "Ratio",
        type: "number",
        placeholder: "10.10",
        min: 0,
        max: 100,
        addOnBefore: "%",
        addOnAfter: "float",
        required: true,
        flex: 1,
    }
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
      setIsFetchList(true);
      setSelectedPackagesRarities([]);
      notification.success({
        message: "Success",
        description: "Selected Packages-Rarities updated successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Selected Packages-Rarities could not be updated!",
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
    const fetchPackages = async () => {
      try {
        const fetchedPackages = await GetAllPackagesAPI();
        setPackages(
          fetchedPackages.map((p) => {
            return {
              value: p.id,
              label: p.name,
              object: p,
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchRarityTypes();
    fetchPackages();
  }, []);

  const handleSelection = (item) => {
    if (selectedPackagesRarities.includes(item)) {
      setSelectedPackagesRarities(selectedPackagesRarities.filter((x) => x.id !== item.id));
    } else {
      setSelectedPackagesRarities([...selectedPackagesRarities, item]);
    }
  };

  const clearSelection = () => {
    setSelectedPackagesRarities([]);
  };

  const handleDelete = async (record) => {
    try {
        const apiVal = {
            packageId: record.packageId,
            rarityTypeId: record.rarityTypeId
        }
      await DeletePackageRarityAPI(apiVal);
      setIsFetchList(true);
      // If the editing toy is deleted, exit edit mode
      if (editingItem && editingItem.packageId == record.packageId && editingItem.rarityTypeId == record.rarityTypeId) {
        handleEditButton(null);
      }
      notification.success({
        message: "Success",
        description: "Package-Rarity deleted successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Package-Rarity could not be deleted!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  }

  const handleDeleteButton = async (record) => {
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
      {selectedPackagesRarities.length ? (
        <>
          <ReusableCheckedCard
            selectedItems={selectedPackagesRarities}
            handleSelection={handleSelection}
            clearSelection={clearSelection}
            handleFinish={handleCheckFinish}
            title={`Selected Packages-Rarities`}
            updateButtonText="Update Selected Packages-Rarities"
            clearButtonText="Clear All"
            updateFormTitle="Update Form"
            formFields={bulkUpdateFormFields}
            selectOptions={{
              rarityTypes: rarityTypes,
              packages: packages,
            }}
            leftCardFlex={3}
            rightCardFlex={2}
            showUpdateForm={true}
            itemDisplayFunction={(packageRarity) =>
              `${packageRarity.package.name} | $${packageRarity.rarityType.name} | ${packageRarity.ratio}`
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
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <PackagesRaritiesList
          handleSelection={handleSelection}
          selectedPackagesRarities={selectedPackagesRarities}
          setSelectedPackagesRarities={setSelectedPackagesRarities}
          isFetchList={isFetchList}
          setIsFetchList={setIsFetchList}
          packagesRarities={packagesRarities}
          setPackagesRarities={setPackagesRarities}
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
          onAdd={AddPackageRarityAPI}
          onUpdate={UpdatePackageRarityAPI}
          onClose={() => handleEditButton(null)}
          setIsFetchList={setIsFetchList}
          entityName="Package-Rarity"
          formFields={editAddFormFields}
          selectOptions={{
            packages: packages,
            rarityTypes: rarityTypes,
          }}
          showImages={false}
          imageUrlsKey="imageUrls"
          noImagesText="No Images Available"
          showIdCard={true}
          fieldsPerRow={3}
          messages={{
            addSuccess: "Package-Rarity added successfully!",
            addError: "Package-Rarity could not be added!",
            updateSuccess: "Package-Rarity updated successfully!",
            updateError: "Package-Rarity could not be updated!",
          }}
        />
      </div>
    </div>
  );
};

export default PackagesRaritiesMainPage;
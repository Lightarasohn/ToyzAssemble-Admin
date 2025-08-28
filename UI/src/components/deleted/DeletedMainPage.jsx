import { useState } from "react";
import { useNotification } from "../../services/NotificationService";
import ReusableDeleteModal from "../../reusableComponents/ReusableDeleteModal";
import DeleteToyTypeAPI from "../../api/toyType/DeleteToyTypeAPI";
import DeletedList from "./DeletedList";
import UnDeleteAPI from "../../api/deleted/UnDeleteAPI";

const DeletedMainPage = () => {
  const [deletedList, setDeletedList] = useState([]);
  const [isFetchList, setIsFetchList] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState([false, null]);
  const notification = useNotification();

  const handleDelete = async (record) => {
    try {
      let apiVal = {};
      
      // Fix: Use toLowerCase() instead of ToLower(), and match backend case name
      if (record.type.toLowerCase() === "packages-raritytypes") {
        apiVal = {
          tableName: record.type,
          id: 0, // Backend expects int, not null - use 0 or remove this property
          packageRarityTypeDto: {
            packageId: parseInt(record.id.split("|")[0]), // Ensure it's a number
            rarityTypeId: parseInt(record.id.split("|")[1]), // Ensure it's a number
          },
        };
      } else {
        apiVal = {
          tableName: record.type, // Fix: Use tableName instead of type
          id: parseInt(record.id), // Ensure it's a number
          packageRarityTypeDto: {
            packageId: 0,
            rarityTypeId: 0
          }
        };
      }

      await UnDeleteAPI(apiVal);
      setIsFetchList(true);
      notification.success({
        message: "Success",
        description: "Undeleted successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error undeleting record:", error);
      notification.error({
        message: "Error",
        description: "Could not be Undeleted!",
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
            flex: 1,
          }}
        >
          <DeletedList
            isFetchList={isFetchList}
            setIsFetchList={setIsFetchList}
            deletedList={deletedList}
            handleDeleteButton={handleDeleteButton}
            setDeletedList={setDeletedList}
          />
          <ReusableDeleteModal
            isOpen={isDeleteModalOpen}
            setIsOpen={setIsDeleteModalOpen}
            record={isDeleteModalOpen[1]}
            handleOk={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default DeletedMainPage;
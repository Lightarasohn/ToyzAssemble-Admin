import { useEffect, useState } from "react";
import ReusableTable from "../../reusableComponents/ReusableTable";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import GetAllPackagesAPI from "../../api/package/GetAllPackagesAPI";
import ReusableDeleteModal from "../../reusableComponents/ReusableDeleteModal";

const PackageList = ({
  handleSelection,
  selectedPackages,
  setSelectedPackages,
  isFetchList,
  setIsFetchList,
  packages, 
  setPackages,
  handleEdit,
  handleDeleteButton
}) => {
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const fetchPackages = async () => {
      try {
        const data = await GetAllPackagesAPI();
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };

  useEffect(() => {
    if (isFetchList) {
      fetchPackages();
      setIsFetchList(false);
    }
  }, [isFetchList]);

  const packageColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    }
  ];

  const handleCheckAll = () => {
    if (selectedPackages.length === filteredPackages.length) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages(filteredPackages);
    }
  };

  return (
    <div
      style={{
        display:"flex",
      }}
    >
      <ReusableTable
        tableTitle={"Packages"}
        data={packages}
        columns={packageColumns}
        loading={listLoading}
        pagination={{}}
        editEnabled={true}
        editButtonFunciton={(record) => handleEdit(record)}
        editInsider={<EditOutlined />}
        checkEnabled={true}
        checkAllEnabled={true}
        checkAllOnChangeFunction={() => handleCheckAll()}
        checkOnChangeFunction={(record) => handleSelection(record)}
        checkedList={selectedPackages}
        deleteEnabled={true}
        deleteButtonFunction={(record) => handleDeleteButton(record)}
        deleteInsider={<DeleteOutlined />}
        size="large"
        enableFilter={true}
        filteredData={filteredPackages}
        setFilteredData={setFilteredPackages}
        reloadButtonEnabled={true}
        reloadButtonFunction={fetchPackages}
      />
    </div>
  );
};

export default PackageList;

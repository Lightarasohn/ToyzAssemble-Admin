import { useEffect, useState } from "react";
import GetAllToysAPI from "../../api/toy/GetAllToysAPI";
import ReusableTable from "../../reusableComponents/ReusableTable";
import { Button, Checkbox } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import GetAllPackagesRaritiesAPI from "../../api/package-rarity/GetAllPackagesRaritiesAPI";

const PackagesRaritiesList = ({
  handleSelection,
  selectedPackagesRarities,
  setSelectedPackagesRarities,
  isFetchList,
  setIsFetchList,
  packagesRarities, 
  setPackagesRarities,
  handleEdit,
  handleDeleteButton
}) => {
  const [filteredPackagesRarities, setFilteredPackagesRarities] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const fetchPackagesRarities = async () => {
      try {
        const data = await GetAllPackagesRaritiesAPI();
        setPackagesRarities(data.map(x => {
          if(x.rarityType.deleted == true){
            x.rarityType.name = null
          }
          if(x.package.deleted == true){
            x.package.name = null
          }
          return x;
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };

  useEffect(() => {
    if (isFetchList) {
      fetchPackagesRarities();
      setIsFetchList(false);
    }
  }, [isFetchList]);

  const packagesRaritiesColumns = [
    { title: "Package", dataIndex: ["package", "name"], key: "package" },
    
    { title: "Rarity", dataIndex: ["rarityType", "name"], key: "rarityType" },
    {
      title: "Ratio",
      dataIndex: "ratio",
      key: "ratio",
      render: (p) => `${p}%`,
    },
  ];

  const handleCheckAll = () => {
    if (selectedPackagesRarities.length === filteredPackagesRarities.length) {
      setSelectedPackagesRarities([]);
    } else {
      setSelectedPackagesRarities(filteredPackagesRarities);
    }
  };

  return (
    <div
      style={{
        display:"flex",
      }}
    >
      <ReusableTable
        tableTitle={"Packages-Rarities"}
        data={packagesRarities}
        columns={packagesRaritiesColumns}
        loading={listLoading}
        pagination={{}}
        editEnabled={true}
        editButtonFunciton={(record) => handleEdit(record)}
        editInsider={<EditOutlined />}
        checkEnabled={true}
        checkAllEnabled={true}
        checkAllOnChangeFunction={() => handleCheckAll()}
        checkOnChangeFunction={(record) => handleSelection(record)}
        checkedList={selectedPackagesRarities}
        deleteEnabled={true}
        deleteButtonFunction={(record) => handleDeleteButton(record)}
        deleteInsider={<DeleteOutlined />}
        size="large"
        enableFilter={true}
        filteredData={filteredPackagesRarities}
        setFilteredData={setFilteredPackagesRarities}
        reloadButtonEnabled={true}
        reloadButtonFunction={fetchPackagesRarities}
      />
    </div>
  );
};

export default PackagesRaritiesList;

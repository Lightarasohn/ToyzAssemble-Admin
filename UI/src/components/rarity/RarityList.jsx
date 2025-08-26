import { useEffect, useState } from "react";
import ReusableTable from "../../reusableComponents/ReusableTable";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import GetAllRarityTypesAPI from "../../api/rarityType/GetAllRarityTypesAPI";


const RarityList = ({
  isFetchList,
  setIsFetchList,
  rarities, 
  setRarities,
  handleEdit,
  handleDeleteButton
}) => {
  const [filteredRarities, setFilteredRarities] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    const fetchRarities = async () => {
      try {
        const data = await GetAllRarityTypesAPI();
        setRarities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };
    if (isFetchList) {
      fetchRarities();
      setIsFetchList(false);
    }
  }, [isFetchList]);

  const rarityColumns = [
    { title: "Name", dataIndex: "name", key: "name" }
  ];

  return (
    <div
      style={{
        display:"flex",
      }}
    >
      <ReusableTable
        tableTitle={"Packages"}
        data={rarities}
        columns={rarityColumns}
        loading={listLoading}
        pagination={{}}
        editEnabled={true}
        editButtonFunciton={(record) => handleEdit(record)}
        editInsider={<EditOutlined />}
        deleteEnabled={true}
        deleteButtonFunction={(record) => handleDeleteButton(record)}
        deleteInsider={<DeleteOutlined />}
        size="large"
        enableFilter={true}
        filteredData={filteredRarities}
        setFilteredData={setFilteredRarities}
      />
    </div>
  );
};

export default RarityList;

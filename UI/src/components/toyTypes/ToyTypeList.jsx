import { useEffect, useState } from "react";
import ReusableTable from "../../reusableComponents/ReusableTable";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import GetAllToyTypesAPI from "../../api/toyType/GetAllToyTypesAPI";


const ToyTypeList = ({
  isFetchList,
  setIsFetchList,
  toyTypes, 
  setToyTypes,
  handleEdit,
  handleDeleteButton
}) => {
  const [filteredToyTypes, setFilteredToyTypes] = useState([]);
  const [listLoading, setListLoading] = useState(true);

    const fetchToyTypes = async () => {
      try {
        const data = await GetAllToyTypesAPI();
        setToyTypes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };

  useEffect(() => {
    if (isFetchList) {
      fetchToyTypes();
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
        tableTitle={"Toy Types"}
        data={toyTypes}
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
        filteredData={filteredToyTypes}
        setFilteredData={setFilteredToyTypes}
        reloadButtonEnabled={true}
        reloadButtonFunction={fetchToyTypes}
      />
    </div>
  );
};

export default ToyTypeList;

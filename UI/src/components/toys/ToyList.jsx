import { useEffect, useState } from "react";
import GetAllToysAPI from "../../api/toy/GetAllToysAPI";
import ReusableTable from "../../reusableComponents/ReusableTable";
import { Button, Checkbox } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ToyList = ({
  handleSelection,
  selectedToys,
  setSelectedToys,
  isFetchList,
  setIsFetchList,
  toys, 
  setToys,
  handleEdit,
  handleDeleteButton
}) => {
  const [filteredToys, setFilteredToys] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const fetchToys = async () => {
      try {
        const data = await GetAllToysAPI();
        setToys(data.map(x => {
          if(x.rarity.deleted == true){
            x.rarity.name = null
          }
          if(x.toyType.deleted == true){
            x.toyType.name = null
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
      fetchToys();
      setIsFetchList(false);
    }
  }, [isFetchList]);

  const toyColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Luck Percentage",
      dataIndex: "luckPercentage",
      key: "luckPercentage",
      render: (p) => `${p}%`,
    },
    { title: "Rarity", dataIndex: ["rarity", "name"], key: "rarity" },
    { title: "Toy Type", dataIndex: ["toyType", "name"], key: "toyType" },
  ];

  const handleCheckAll = () => {
    if (selectedToys.length === filteredToys.length) {
      setSelectedToys([]);
    } else {
      setSelectedToys(filteredToys);
    }
  };

  return (
    <div
      style={{
        display:"flex",
      }}
    >
      <ReusableTable
        tableTitle={"Toyz"}
        data={toys}
        columns={toyColumns}
        loading={listLoading}
        pagination={{}}
        editEnabled={true}
        editButtonFunciton={(record) => handleEdit(record)}
        editInsider={<EditOutlined />}
        checkEnabled={true}
        checkAllEnabled={true}
        checkAllOnChangeFunction={() => handleCheckAll()}
        checkOnChangeFunction={(record) => handleSelection(record)}
        checkedList={selectedToys}
        deleteEnabled={true}
        deleteButtonFunction={(record) => handleDeleteButton(record)}
        deleteInsider={<DeleteOutlined />}
        size="large"
        enableFilter={true}
        filteredData={filteredToys}
        setFilteredData={setFilteredToys}
        reloadButtonEnabled={true}
        reloadButtonFunction={fetchToys}
      />
    </div>
  );
};

export default ToyList;

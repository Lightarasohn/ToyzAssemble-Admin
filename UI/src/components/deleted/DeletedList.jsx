import { useEffect, useState } from "react";
import ReusableTable from "../../reusableComponents/ReusableTable";
import { DeleteFilled, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import GetAllToyTypesAPI from "../../api/toyType/GetAllToyTypesAPI";
import GetAllDeletedAPI from "../../api/deleted/GetAllDeletedAPI";

const DeletedList = ({
  isFetchList,
  setIsFetchList,
  deletedList,
  setDeletedList,
  handleDeleteButton,
}) => {
  const [filteredDeletedList, setFilteredDeletedList] = useState([]);
  const [listLoading, setListLoading] = useState(true);

    useEffect(() => {
        console.log(deletedList);
    },[deletedList])

  const fetchDeletedList = async () => {
    try {
      const data = await GetAllDeletedAPI();
      
      const toys = data.toys.map((toy) => ({
        id: toy.id,
        name: toy.name,
        type: "toys",
        displayType: "Toy",
        object: toy
      }));

      const packages = data.packages.map(pckg => ({
        id: pckg.id,
        name: pckg.name,
        type: "packages",
        displayType: "Package",
        object: pckg
      }));

      const toyTypes = data.toyTypes.map(tt => ({
        id: tt.id,
        name: tt.name,
        type: "toyTypes",
        displayType: "Toy Type",
        object: tt
      }));

      const rarityTypes = data.rarityTypes.map(rt => ({
        id: rt.id,
        name: rt.name,
        type: "rarityTypes",
        displayType: "Rarity Type",
        object: rt
      }));

      const packageRarityTypes = data.packageRarityTypes.map(prt => ({
        //todo
      }))

      setDeletedList([...toys, ...packages, ...toyTypes, ...rarityTypes]);
      
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (isFetchList) {
      fetchDeletedList();
      setIsFetchList(false);
    }
  }, [isFetchList]);

  const deletedColumns = [
        { title: "Id", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Type", dataIndex: "displayType", key: "displayType" }
    ];

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <ReusableTable
        tableTitle={"Deleted "}
        data={deletedList}
        columns={deletedColumns}
        loading={listLoading}
        pagination={{}}
        checkEnabled={false}
        checkOnCellStyle={null}
        checkOnHeaderCellStyle={null}
        checkOnRowStyle={null}
        checkedList={null}
        checkAllEnabled={null}
        checkAllOnChangeFunction={null}
        checkOnChangeFunction={null}
        editEnabled={false}
        editButtonFunciton={null}
        editInsider={<EditOutlined />}
        deleteEnabled={true}
        deleteButtonFunction={(record) => handleDeleteButton(record)}
        deleteInsider={<DeleteFilled />}
        size="large"
        enableFilter={true}
        filteredData={filteredDeletedList}
        setFilteredData={setFilteredDeletedList}
        reloadButtonEnabled={true}
        reloadButtonFunction={fetchDeletedList}
      />
    </div>
  );
};

export default DeletedList;

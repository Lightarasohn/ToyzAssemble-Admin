import { useEffect, useState } from "react";
import GetAllToysAPI from "../../api/toy/GetAllToysAPI";
import ReusableTable from "../../reusableComponents/ReusableTable";
import { Button, Checkbox } from "antd";
import { EditOutlined } from "@ant-design/icons";

const ToyList = ({handleSelection, selectedToys, isFetchList, setIsFetchList}) => {
    const [toys, setToys] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    

    const toyColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price',
            render: (price) => `$${price}` },
        { title: 'Luck Percentage', dataIndex: 'luckPercentage', key: 'luckPercentage',
            render: (p) => `${p}%` },
        { title: 'Rarity', dataIndex: ['rarity', 'name'], key: 'rarity' },
        { title: 'Toy Type', dataIndex: ['toyType', 'name'], key: 'toyType' },
    ];

    useEffect(() => {
        const fetchToys = async () => {
            try {
                const data = await GetAllToysAPI();
                setToys(data);
            } catch (err) {
                console.error(err);
            } finally {
                setListLoading(false);
            }
        };
        if(isFetchList){
            fetchToys();
            setIsFetchList(false);
        }
    }, [isFetchList]);

    return (
        <ReusableTable
            data={toys} 
            columns={toyColumns} 
            loading={listLoading} 
            pagination={{}}
            editEnabled={true}
            editButtonFunciton={(record) => console.log("edit:",record)}
            editInsider={<EditOutlined />}
            editOnRowStyle={{width:"1px", height: "1000px"}}
            checkEnabled={true}
            checkOnChangeFunction={(record) => handleSelection(record)}
            checkedList={selectedToys}
        />
    );
};

export default ToyList;

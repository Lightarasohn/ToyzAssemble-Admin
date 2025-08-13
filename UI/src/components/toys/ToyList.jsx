import { useEffect, useState } from "react";
import GetAllToysAPI from "../../api/toys/GetAllToysAPI";
import { Table } from "antd";

const ToyList = () => {
    const [toys, setToys] = useState([]);
    
    // Antd Table için doğru column yapısı
    const toyColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`,
        },
        {
            title: 'Luck Percentage',
            dataIndex: 'luckPercentage',
            key: 'luckPercentage',
            render: (percentage) => `${percentage}%`,
        },
        {
            title: 'Rarity',
            dataIndex: ['rarity', 'name'], // nested object access
            key: 'rarity',
        },
        {
            title: 'Toy Type',
            dataIndex: ['toyType', 'name'], // nested object access
            key: 'toyType',
        }
    ];

    useEffect(() => {
        const fetchToys = async () => {
            const data = await GetAllToysAPI();
            setToys(data);
        }
        fetchToys();
    }, []);

    return (
        <Table
            style={{
            }}
            dataSource={toys}
            columns={toyColumns} 
            pagination={{responsive: true }}
            bordered={true}
            rowKey="id"

        />
    );
}

export default ToyList;
import { Button, Checkbox, Table } from "antd";
import React from "react";

const addFunctionalityColumns = (
  columns,
  editEnabled,
  editButtonFunciton,
  editInsider,
  editOnHeaderCellStyle,
  editOnRowStyle,
  editOnCellStyle,
  checkEnabled,
  checkOnChangeFunction,
  checkedList,
  checkOnHeaderCellStyle,
  checkOnRowStyle,
  checkOnCellStyle,
  deleteEnabled,
  deleteButtonFunction,
  deleteInsider,
  deleteOnHeaderCellStyle,
  deleteOnRowStyle,
  deleteOnCellStyle
) => {
  const newColumns = [...columns];
  if (deleteEnabled) {
    newColumns.push({
      title: "",
      dataIndex: "delete",
      key: "delete",
      render: (cellVal, record, rowIndex) => (
        <Button onClick={() => deleteButtonFunction(record)}>
          {deleteInsider}
        </Button>
      ),
      onCell: (record, rowIndex) => ({
        style: deleteOnCellStyle,
      }),
      onHeaderCell: (column) => ({
        style: deleteOnHeaderCellStyle,
      }),
      onRow: (record, rowIndex) => ({
        style: deleteOnRowStyle,
      }),
    });
  }
  if (editEnabled) {
    newColumns.unshift({
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (cellVal, record, rowIndex) => (
        <Button onClick={() => editButtonFunciton(record)}>
          {editInsider}
        </Button>
      ),
      onCell: (record, rowIndex) => ({
        style: editOnCellStyle,
      }),
      onHeaderCell: (column) => ({
        style: editOnHeaderCellStyle,
      }),
      onRow: (record, rowIndex) => ({
        style: editOnRowStyle,
      }),
    });
  }
  if (checkEnabled) {
    newColumns.unshift({
      title: "",
      dataIndex: "select",
      key: "select",
      render: (cellVal, record, rowIndex) => (
        <Checkbox
          checked={checkedList.some((t) => t.id === record.id)}
          onChange={() => checkOnChangeFunction(record)}
        ></Checkbox>
      ),
      onCell: (record, rowIndex) => ({
        style: checkOnCellStyle,
      }),
      onHeaderCell: (column) => ({
        style: checkOnHeaderCellStyle,
      }),
      onRow: (record, rowIndex) => ({
        style: checkOnRowStyle,
      }),
    });
  }

  return newColumns;
};

// Otomatik sorter ekleyen yardımcı fonksiyon
const addSorterToColumns = (columns) => {
  return columns.map((col) => {
    // Eğer dataIndex varsa ve sorter eklenmemişse otomatik ekle
    if (col.dataIndex && !col.sorter && col.title !== "") {
      return {
        ...col,
        sorter: (a, b) => {
          const aValue = getValueByDataIndex(a, col.dataIndex);
          const bValue = getValueByDataIndex(b, col.dataIndex);

          if (typeof aValue === "string" && typeof bValue === "string") {
            return aValue.localeCompare(bValue);
          }
          if (typeof aValue === "number" && typeof bValue === "number") {
            return aValue - bValue;
          }
          return 0;
        },
        sortDirections: ["ascend", "descend"],
      };
    }
    return col;
  });
};

// Nested dataIndex desteği (ör: ['rarity', 'name'])
const getValueByDataIndex = (record, dataIndex) => {
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce((acc, key) => acc?.[key], record);
  }
  return record[dataIndex];
};

const ReusableTable = ({
  data,
  columns,
  loading,
  rowKey = "id",
  pagination = {},
  editEnabled,
  editButtonFunciton = console.log("Set editButtonFunction please!"),
  editInsider = "Edit",
  editOnHeaderCellStyle,
  editOnRowStyle,
  editOnCellStyle,
  checkEnabled,
  checkOnChangeFunction = console.log("Set checkOnChangeFunction please!"),
  checkedList,
  checkOnHeaderCellStyle,
  checkOnRowStyle,
  checkOnCellStyle,
  deleteEnabled,
  deleteButtonFunction,
  deleteInsider = "Delete",
  deleteOnHeaderCellStyle,
  deleteOnRowStyle,
  deleteOnCellStyle
}) => {
  const newColumns = addFunctionalityColumns(
    columns,
    editEnabled,
    editButtonFunciton,
    editInsider,
    editOnHeaderCellStyle,
    editOnRowStyle,
    editOnCellStyle,
    checkEnabled,
    checkOnChangeFunction,
    checkedList,
    checkOnHeaderCellStyle,
    checkOnRowStyle,
    checkOnCellStyle,
    deleteEnabled,
    deleteButtonFunction,
    deleteInsider,
    deleteOnHeaderCellStyle,
    deleteOnRowStyle,
    deleteOnCellStyle
  );
  const columnsWithSorter = addSorterToColumns(newColumns);

  return (
    <Table
      dataSource={data}
      columns={columnsWithSorter}
      rowKey={rowKey}
      loading={loading}
      bordered
      rowHoverable
      showHeader
      scroll={{ x: "max-content" }}
      pagination={{
        responsive: true,
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      }}
    />
  );
};

export default ReusableTable;

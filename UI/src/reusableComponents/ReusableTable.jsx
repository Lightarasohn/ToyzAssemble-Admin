import { FilterFilled, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Popover,
  Select,
  Table,
  Tag,
  theme,
} from "antd";
import React, { useState } from "react";

const addFunctionalityColumns = (
  data,
  columns,
  editEnabled,
  editButtonFunciton,
  editInsider,
  editOnHeaderCellStyle,
  editOnRowStyle,
  editOnCellStyle,
  checkEnabled,
  checkAllEnabled,
  checkAllOnChangeFunction,
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
        <Button danger type="text" onClick={() => deleteButtonFunction(record)}>
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
        <Button
          onClick={() => editButtonFunciton(record)}
          type="text"
          size="small"
        >
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
      title: checkAllEnabled ? (
        <Checkbox
          checked={checkedList.length === data.length}
          onChange={() => checkAllOnChangeFunction()}
        />
      ) : (
        ""
      ),
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
  data, // @array
  columns, // @array
  loading = true, // @boolean
  rowKey = "id", // @rowkey (id)
  pagination = {}, // @object
  editEnabled = true, // @boolean
  editButtonFunciton = console.log("Set editButtonFunction please!"), // @function()
  editInsider = "Edit", // @text | component
  editOnHeaderCellStyle, // @style
  editOnRowStyle, // @style object
  editOnCellStyle, // @style object
  checkEnabled, // @boolean
  checkAllEnabled = true, // @boolean
  checkAllOnChangeFunction = console.log("Set checkOnAllChangeFunction please"), // @function()
  checkOnChangeFunction = console.log("Set checkOnChangeFunction please!"), // @function()
  checkedList, // @array
  checkOnHeaderCellStyle, // @style object
  checkOnRowStyle, // @style object
  checkOnCellStyle, // @style object
  deleteEnabled = true, // @boolean
  deleteButtonFunction = console.log("Set deleteButtonFunction please!"), // @function()
  deleteInsider = "Delete", // @text | component
  deleteOnHeaderCellStyle, // @style object
  deleteOnRowStyle, // @style object
  deleteOnCellStyle, // @style object
  size = "middle", // @large | middle | small
  enableFilter = true,
  onFiltersApply = () => console.log("Set onFiltersApply function please!"), // @function(filters)
}) => {
  const newColumns = addFunctionalityColumns(
    data,
    columns,
    editEnabled,
    editButtonFunciton,
    editInsider,
    editOnHeaderCellStyle,
    editOnRowStyle,
    editOnCellStyle,
    checkEnabled,
    checkAllEnabled,
    checkAllOnChangeFunction,
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
  const [filters, setFilters] = useState([]);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  const filterOperators = [
    { value: "=", label: "equals" },
    { value: "==", label: "like operator" },
    { value: "!==", label: "not equal" },
    { value: ">", label: "grater than" },
    { value: ">=", label: "grater than or equal" },
    { value: "<", label: "less than" },
    { value: "<=", label: "less than or equal" },
  ];

  const handleAddFilter = () => {
    let newFilter = {
      key: filters.length,
      name: columns[0].dataIndex,
      operator: filterOperators[0].value,
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (item) => {
    setFilters(filters.filter((x) => x.key !== item.key));
    if(filters.length == 1){ // useState'in set metotu fonksiyon bittikten sonra çalışır.
      setAppliedFiltersCount(0);
    }
  };

  const handleFilterChange = (filterKey, field, value) => {
    setFilters(filters.map(filter => 
      filter.key === filterKey 
        ? { ...filter, [field]: value }
        : filter
    ));
  };

  const handleApplyFilters = () => {
    onFiltersApply(filters);
    setAppliedFiltersCount(filters.length)
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {enableFilter ? (
        <Popover
          content={
            <>
              {filters.length ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    minWidth: "300px"
                  }}
                >
                  {filters.map((filter) => (
                    <Tag
                      key={filter.key}
                      closable={true}
                      onClose={() => handleRemoveFilter(filter)}
                      style={{
                        display:"flex", flexDirection: "row",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", gap: "4px" }}>
                        <Select
                          value={filter.name}
                          onChange={(value) => handleFilterChange(filter.key, 'name', value)}
                          options={columns
                            .filter(col => col.dataIndex && col.title !== "")
                            .map(col => ({ 
                              value: col.dataIndex, 
                              label: col.title 
                            }))}
                          style={{ width: "100%" }}
                          size="small"
                        />
                        <Select
                          value={filter.operator}
                          onChange={(value) => handleFilterChange(filter.key, 'operator', value)}
                          options={filterOperators.map(op => ({
                            value: op.value,
                            label: `[${op.value}] ${op.label}`
                          }))}
                          style={{ width: "100%" }}
                          size="small"
                          optionRender={(option) => `[${option.value}] ${option.data.label.split('] ')[1]}`}
                        />
                        <Input
                          value={filter.value}
                          onChange={(e) => handleFilterChange(filter.key, 'value', e.target.value)}
                          placeholder="Filter value"
                          size="small"
                        />
                      </div>
                    </Tag>
                  ))}
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <Button
                      icon={<PlusOutlined />}
                      size="small"
                      type="text"
                      onClick={() => handleAddFilter()}
                    >
                      Add Filter
                    </Button>
                    <Button 
                      icon={<SaveOutlined />}
                      size="small"
                      type="text"
                      disabled={filters.length === 0}
                      onClick={handleApplyFilters}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  Add a column below to filter the view
                  <Divider style={{ padding: "0px" }}></Divider>
                  <Button
                    icon={<PlusOutlined />}
                    size="small"
                    type="text"
                    onClick={() => handleAddFilter()}
                  >
                    Add Filter
                  </Button>
                  <Button icon={<SaveOutlined />}
                    size="small"
                    type="text"
                    disabled={filters.length === 0}
                    onClick={() => handleApplyFilters()}
                  >
                    Apply Filter
                  </Button>
                </>
              )}
            </>
          }
          title={filters.length ? "" : "No filters applied to this table"}
          trigger={"click"}
          arrow={false}
          autoAdjustOverflow={true}
          fresh={false}
          destroyOnHidden={false}
          placement="bottomLeft"
        >
          <Button
            style={{
              maxWidth: "13%",
            }}
            icon={<FilterFilled />}
          >
            Filter {appliedFiltersCount > 0 ? `(${appliedFiltersCount})` : ""}
          </Button>
        </Popover>
      ) : null}
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
        size={size}
      />
    </div>
  );
};

export default ReusableTable;
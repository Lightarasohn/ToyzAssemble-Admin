import { Card, Tag, Button, Form, InputNumber, Select, Divider } from "antd";
import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";

const ReusableCheckedCard = ({
  // Ana veri ve seçim yönetimi
  selectedItems = [],
  handleSelection = () => console.log("Set handleSelection function please!"),
  clearSelection = () => console.log("Set clearSelection function please!"),
  
  // Form Bitirme
  handleFinish = () => console.log("Set handleFinish function please"),

  // Başlık ve metinler
  title = "Selected Items",
  updateButtonText = "Update Selected Items",
  clearButtonText = "Clear All",
  updateFormTitle = "Update Form",
  
  // Form alanları konfigürasyonu
  formFields = [],
  
  // Select option'ları
  selectOptions = {},
  
  // Özelleştirme
  leftCardFlex = 3,
  rightCardFlex = 2,
  showUpdateForm = true,
  
  // Item display konfigürasyonu
  itemDisplayFunction = null, // Özel görüntüleme fonksiyonu
}) => {
  const [form] = Form.useForm();
  
  // Default item display function
  const defaultItemDisplayFunction = (item) => {
    return `${item.name || item.id}`;
  };
  
  const displayFunction = itemDisplayFunction || defaultItemDisplayFunction;
  
  // Form alanlarını render etme fonksiyonu
  const renderFormField = (field) => {
    const { 
      name, 
      label, 
      type = "input", 
      placeholder, 
      min, 
      max, 
      addOnBefore, 
      addOnAfter,
      flex = 1,
      selectKey = name
    } = field;
    
    const baseStyle = { flex };
    
    switch (type) {
      case "number":
        return (
          <Form.Item 
            key={name}
            label={label} 
            name={name} 
            style={baseStyle}
          >
            <InputNumber
              addonBefore={addOnBefore}
              addonAfter={addOnAfter}
              min={min}
              max={max}
              placeholder={placeholder}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );
        
      case "select":
        return (
          <Form.Item 
            key={name}
            label={label} 
            name={name} 
            style={baseStyle}
          >
            <Select
              placeholder={placeholder}
              options={selectOptions[selectKey] || []}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            />
          </Form.Item>
        );
        
      default:
        return (
          <Form.Item 
            key={name}
            label={label} 
            name={name} 
            style={baseStyle}
          >
            <Input placeholder={placeholder} />
          </Form.Item>
        );
    }
  };
  
  // Form alanlarını gruplar halinde düzenle
  const renderFormRows = () => {
    const rows = [];
    for (let i = 0; i < formFields.length; i += 2) {
      const fieldsInRow = formFields.slice(i, i + 2);
      rows.push(
        <div key={i} style={{ display: "flex", gap: "16px" }}>
          {fieldsInRow.map(renderFormField)}
        </div>
      );
    }
    return rows;
  };
  
  if (selectedItems.length === 0) {
    return null; // Seçili öğe yoksa component'i gösterme
  }
  
  return (
    <div className="responsive-checked-card-container">
      <div className="responsive-checked-card-left">
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            flex: leftCardFlex,
            gap: "8px",
            minWidth: "260px",
            width: "100%",
            boxSizing: "border-box",
          }}
          className="responsive-checked-card-left"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Title level={3} style={{ margin: 0, fontSize: "1.2rem" }}>
              {title} ({selectedItems.length})
            </Title>
            <Button size="small" onClick={clearSelection}>
              {clearButtonText}
            </Button>
          </div>

          <Divider />

          {/* Seçili öğeleri listele */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              width: "100%",
            }}
          >
            {selectedItems.map((item) => (
              <Tag
                key={item.id}
                closable
                onClose={() => handleSelection(item)}
                style={{
                  fontSize: "1rem",
                  padding: "4px 8px",
                  marginBottom: "4px",
                }}
              >
                {displayFunction(item)}
              </Tag>
            ))}
          </div>
        </Card>
      </div>
      {showUpdateForm && (
        <div className="responsive-checked-card-right">
          <Card
            className="responsive-checked-card-right"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: rightCardFlex,
              minWidth: "260px",
              width: "100%",
              boxSizing: "border-box",
              marginTop: "0px",
            }}
          >
            <Title level={3} style={{ fontSize: "1.2rem" }}>{updateFormTitle}</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                width: "100%",
              }}
            >
              {renderFormRows()}

              <Button
                htmlType="submit"
                type="primary"
                disabled={selectedItems.length === 0}
                style={{ marginTop: "16px", width: "100%" }}
              >
                {updateButtonText}
              </Button>
            </Form>
          </Card>
        </div>
      )}

      {/* Responsive CSS */}
      <style>
        {`
          .responsive-checked-card-container {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
            min-width: 300px;
          }
          @media (max-width: 900px) {
            .responsive-checked-card-container {
              flex-direction: column !important;
              gap: 16px !important;
            }
            .responsive-checked-card-left,
            .responsive-checked-card-right {
              width: 100% !important;
              min-width: 0 !important;
              box-sizing: border-box !important;
            }
          }
          @media (max-width: 600px) {
            .responsive-checked-card-left .ant-card,
            .responsive-checked-card-right .ant-card {
              min-width: 240px !important;
              max-width: 100vw !important;
              padding: 12px !important;
              font-size: 13px !important;
              box-sizing: border-box !important;
              overflow-x: auto !important;
            }
            .responsive-checked-card-left,
            .responsive-checked-card-right {
              padding: 0 !important;
            }
            .responsive-form-row {
              flex-direction: column !important;
              gap: 8px !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
            .ant-form-item {
              width: 100% !important;
              min-width: 0 !important;
              box-sizing: border-box !important;
            }
          }
          @media (max-width: 420px) {
            .responsive-checked-card-left .ant-card,
            .responsive-checked-card-right .ant-card {
              min-width: 400px !important;
              padding: 8px !important;
              font-size: 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ReusableCheckedCard;
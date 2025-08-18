import { Card, Tag, Button, Form, InputNumber, Select } from "antd";
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
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignContent: "center",
        gap: "16px",
      }}
    >
      {/* Seçili öğeleri gösteren kart */}
      <Card
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          flex: leftCardFlex, 
          gap: "8px" 
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            {title} ({selectedItems.length})
          </Title>
          <Button size="small" onClick={clearSelection}>
            {clearButtonText}
          </Button>
        </div>
        
        {/* Seçili öğeleri listele */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {selectedItems.map((item) => (
            <Tag 
              key={item.id} 
              closable 
              onClose={() => handleSelection(item)}
            >
              {displayFunction(item)}
            </Tag>
          ))}
        </div>
      </Card>
      
      {/* Güncelleme formu kartı */}
      {showUpdateForm && (
        <Card
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            flex: rightCardFlex 
          }}
        >
          <Title level={3}>{updateFormTitle}</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0px" 
            }}
          >
            {renderFormRows()}
            
            <Button 
              htmlType="submit" 
              type="primary"
              disabled={selectedItems.length === 0}
            >
              {updateButtonText}
            </Button>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default ReusableCheckedCard;
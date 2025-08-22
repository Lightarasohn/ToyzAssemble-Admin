import {
  Button,
  Card,
  Carousel,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import { useNotification } from "../services/NotificationService";

const ReusableEditAddCard = ({
  // Form instance (shared from parent)
  form,

  // Entity data
  editingItem = null,
  isEditing = false,

  // Callbacks
  onAdd = () => console.log("Set onAdd function please!"),
  onUpdate = () => console.log("Set onUpdate function please!"),
  onClose = () => console.log("Set onClose function please!"),
  setIsFetchList = () => console.log("Set setIsFetchList function please!"),

  // Configuration
  entityName = "Item", // "Toy", "User", "Product", etc.

  // Form fields configuration
  formFields = [],

  // Select options for dropdowns
  selectOptions = {},

  // Images configuration
  showImages = false,
  imageUrlsKey = "imageUrls", // key in the item object for images
  noImagesText = "No Images Available",

  // ID display configuration
  showIdCard = true,

  // Styling
  cardStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxHeight: "100%",
    marginTop: "70px",
    marginBottom: "70px",
    overflow: "hidden",
    flexShrink: 1,
  },

  // Custom validation rules
  customValidationRules = {},

  // Success/Error messages
  messages = {
    addSuccess: `${entityName} added successfully!`,
    addError: `${entityName} could not be added!`,
    updateSuccess: `${entityName} updated successfully!`,
    updateError: `${entityName} could not be updated!`,
  },

  // Custom rendering functions
  customHeaderRenderer = null,
  customImageRenderer = null,

  // Layout configuration
  formLayout = "vertical",
  fieldsPerRow = 3,
}) => {
  const notification = useNotification();

  const handleAddFinish = async (val) => {
    try {
      await onAdd(val);
      setIsFetchList(true);
      form.resetFields();
      notification.success({
        message: "Success",
        description: messages.addSuccess,
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Error",
        description: messages.addError,
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  };

  const handleUpdateFinish = async (val) => {
    if (!editingItem) return;

    try {
      await onUpdate(val, editingItem.id);
      setIsFetchList(true);
      onClose();
      notification.success({
        message: "Success",
        description: messages.updateSuccess,
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Error",
        description: messages.updateError,
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  };

  const handleFormSubmit = (val) => {
    if (isEditing) {
      handleUpdateFinish(val);
    } else {
      handleAddFinish(val);
    }
  };

  // Form alanlarını render etme fonksiyonu
  const renderFormField = (field) => {
    const {
      name,
      label,
      type = "input",
      placeholder,
      min,
      max,
      step,
      addOnBefore,
      addOnAfter,
      flex = 1,
      selectKey = name,
      required = false,
      rules = [],
      disabled = false,
      style = {},
    } = field;

    const baseStyle = { flex, ...style };

    // Custom validation rules'u ekle
    const fieldRules = [
      ...(required
        ? [{ required: true, message: `Please input ${label.toLowerCase()}!` }]
        : []),
      ...(customValidationRules[name] || []),
      ...rules,
    ];

    switch (type) {
      case "number":
        return (
          <Form.Item
            key={name}
            label={label}
            name={name}
            style={baseStyle}
            rules={fieldRules}
          >
            <InputNumber
              addonBefore={addOnBefore}
              addonAfter={addOnAfter}
              min={min}
              max={max}
              step={step}
              placeholder={placeholder}
              disabled={disabled}
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
            rules={fieldRules}
          >
            <Select
              placeholder={placeholder}
              options={selectOptions[selectKey] || []}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
              disabled={disabled}
              popupMatchSelectWidth={false}
            />
          </Form.Item>
        );

      case "textarea":
        return (
          <Form.Item
            key={name}
            label={label}
            name={name}
            style={baseStyle}
            rules={fieldRules}
          >
            <Input.TextArea
              placeholder={placeholder}
              disabled={disabled}
              rows={4}
            />
          </Form.Item>
        );

      default: // "input"
        return (
          <Form.Item
            key={name}
            label={label}
            name={name}
            style={baseStyle}
            rules={fieldRules}
          >
            <Input placeholder={placeholder} disabled={disabled} />
          </Form.Item>
        );
    }
  };

  // Form alanlarını satırlar halinde grupla
  const renderFormRows = () => {
    const rows = [];
    for (let i = 0; i < formFields.length; i += fieldsPerRow) {
      const fieldsInRow = formFields.slice(i, i + fieldsPerRow);
      rows.push(
        <div key={i} style={{ display: "flex", gap: "16px" }}>
          {fieldsInRow.map(renderFormField)}
        </div>
      );
    }
    return rows;
  };

  // Default header renderer
  const renderHeader = () => {
    if (customHeaderRenderer) {
      return customHeaderRenderer(editingItem, isEditing, entityName);
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Title level={3}>
          {isEditing
            ? editingItem?.name || `Edit ${entityName}`
            : `Add New ${entityName}`}
        </Typography.Title>
        <div style={{ display: "flex", gap: "8px" }}>
          {isEditing && <Button onClick={onClose}>Close</Button>}
        </div>
      </div>
    );
  };

  // Image rendering
  const renderImages = () => {
    if (!showImages || !isEditing || !editingItem) return null;

    if (customImageRenderer) {
      return customImageRenderer(editingItem);
    }

    const images = editingItem.imageUrls;
    console.log(images);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          marginBottom: "16px",
        }}
      >
        <Carousel
          style={{ display: "flex", width: "300px" }}
          arrows
          infinite={false}
        >
          {images && images.length > 0 ? (
            images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                }}
              >
                <img
                  src={img}
                  alt={`${entityName.toLowerCase()}-${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    border: "1px solid red", // debug için kutu çiz
                  }}
                />
              </div>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <Typography.Text type="secondary">{noImagesText}</Typography.Text>
            </div>
          )}
        </Carousel>
      </div>
    );
  };

  return (
    <Card style={cardStyle}>
      {renderHeader()}

      <Divider />

      {renderImages()}

      {/* ID display (only in edit mode) */}
      {showIdCard && isEditing && editingItem && (
        <Card size="small" style={{ marginBottom: "16px" }}>
          ID: {editingItem.id}
        </Card>
      )}

      {/* Form */}
      <Form
        form={form}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        onFinish={handleFormSubmit}
        layout={formLayout}
      >
        {renderFormRows()}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          {isEditing && (
            <Button onClick={() => form.resetFields()}>Reset</Button>
          )}
          <Button type="primary" htmlType="submit">
            {isEditing ? `Update ${entityName}` : `Add ${entityName}`}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ReusableEditAddCard;

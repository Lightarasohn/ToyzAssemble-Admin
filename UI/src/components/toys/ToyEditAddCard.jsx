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
import { useNotification } from "../../services/NotificationService";
import AddToyAPI from "../../api/toy/AddToyAPI";
import UpdateToyAPI from "../../api/toy/UpdateToyAPI";

const ToyEditAddCard = ({
  form, // Receive the shared form instance from parent
  editingToy,
  isEditing,
  toyTypes,
  rarityTypes,
  handleEditButton,
  setIsFetchList,
  setEditingToy,
  setIsEditing,
}) => {
  const notification = useNotification();

  const handleAddToyFinish = async (val) => {
    try {
      await AddToyAPI(val);
      setIsFetchList(true);
      form.resetFields(); // Now this will work correctly
      notification.success({
        message: "Success",
        description: "Toy added successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Error",
        description: "Toy could not be added!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  };

  const handleEditFinish = async (val) => {
    if (!editingToy) return;

    try {
      await UpdateToyAPI(val, editingToy.id);
      setIsFetchList(true);
      handleEditButton(null); // Edit modundan çık
      notification.success({
        message: "Success",
        description: "Toy updated successfully!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Error",
        description: "Toy could not be updated!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  };

  // Form submit handler
  const handleFormSubmit = (val) => {
    if (isEditing) {
      handleEditFinish(val);
    } else {
      handleAddToyFinish(val);
    }
  };

  const handleAddButton = () => {
    setEditingToy(null);
    setIsEditing(false);
    form.resetFields(); // Now this will work correctly
  };

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxHeight: "100%",
        marginTop: "70px",
        marginBottom: "70px",
        overflow: "hidden",
        flexShrink: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Title level={3}>
          {isEditing ? editingToy?.name : "Add New Toy"}
        </Typography.Title>
        <div style={{ display: "flex", gap: "8px" }}>
          {isEditing && (
            <Button onClick={() => handleEditButton(null)}>Close</Button>
          )}
        </div>
      </div>

      <Divider />

      {/* Sadece edit modunda görselleri göster */}
      {isEditing && editingToy && (
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
            {editingToy.imageUrls && editingToy.imageUrls.length > 0 ? (
              editingToy.imageUrls.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px", // sabit yükseklik koymak önemli
                  }}
                >
                  <img
                    src={img}
                    alt={`toy-${idx}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    crossOrigin="anonymous"
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
                <Typography.Text type="secondary">
                  No Images Available
                </Typography.Text>
              </div>
            )}
          </Carousel>
        </div>
      )}

      {/* ID gösterimi (sadece edit modunda) */}
      {isEditing && editingToy && (
        <Card size="small" style={{ marginBottom: "16px" }}>
          ID: {editingToy.id}
        </Card>
      )}

      {/* Form - Now connected to the shared form instance */}
      <Form
        form={form} // Use the shared form instance from parent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            justifyContent: "space-between",
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please input toy name!" }]}
          >
            <Input placeholder="Enter toy name" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber
              addonBefore="$"
              addonAfter="float"
              min={0}
              max={1000}
              style={{ width: "100%" }}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            label="Luck Percentage"
            name="luckPercentage"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: "Please input luck percentage!" },
            ]}
          >
            <InputNumber
              addonBefore="%"
              addonAfter="float"
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="0.00"
            />
          </Form.Item>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
          }}
        >
          <Form.Item
            label="Toy Type"
            name="toyTypeId"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please select toy type!" }]}
          >
            <Select
              placeholder="Select toy type"
              options={toyTypes}
              popupMatchSelectWidth={false}
            />
          </Form.Item>

          <Form.Item
            label="Rarity"
            name="rarityId"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please select rarity!" }]}
          >
            <Select
              placeholder="Select rarity"
              options={rarityTypes}
              popupMatchSelectWidth={false}
            />
          </Form.Item>
        </div>

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
            {isEditing ? "Update Toy" : "Add Toy"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ToyEditAddCard;

import { useEffect, useState } from "react";
import ToyList from "./ToyList";
import ReusableCheckedCard from "../../reusableComponents/ReusableCheckedCard";
import GetAllToyTypesAPI from "../../api/toyType/GetAllToyTypesAPI";
import GetAllRarityTypesAPI from "../../api/rarityType/GetAllRarityTypesAPI";
import { useNotification } from "../../services/NotificationService";
import UpdateSelectedToysAPI from "../../api/toyService/UpdateSelectedToysAPI";
import { Button, Card, Carousel, Divider, Typography } from "antd";

const ToyMainPage = () => {
  const [toys, setToys] = useState([]);
  const [selectedToys, setSelectedToys] = useState([]);
  const [isFetchList, setIsFetchList] = useState(true);
  const [rarityTypes, setRarityTypes] = useState([]);
  const [toyTypes, setToyTypes] = useState([]);
  const [editingToy, setEditingToy] = useState(null);
  const notification = useNotification();

  const handleEdit = (record) => {
    setEditingToy(record);
  }

  const formFields = [
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "10.10",
      min: 0,
      max: 100,
      addOnBefore: "$",
      addOnAfter: "float",
      flex: 1,
    },
    {
      name: "luckPercentage",
      label: "Luck Percentage",
      type: "number",
      placeholder: "0.42",
      min: 0,
      max: 100,
      addOnBefore: "%",
      addOnAfter: "float",
      flex: 1,
    },
    {
      name: "rarityTypeId",
      label: "Rarity",
      type: "select",
      placeholder: "Common, Rare, Epic...",
      flex: 1,
      selectKey: "rarityTypes",
    },
    {
      name: "toyTypeId",
      label: "Toy Type",
      type: "select",
      placeholder: "Classic, Special, Accessory...",
      flex: 1,
      selectKey: "toyTypes",
    },
  ];

  const normalizeFormValues = (val) => {
    return Object.fromEntries(
      Object.entries(val).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    );
  };


  const handleFinish = async (val) => {
    const normalizedVal = normalizeFormValues(val);
    const apiVal = {
      idList: selectedToys.map((x) => x.id),
      updateDto: normalizedVal,
    };
    try {
      await UpdateSelectedToysAPI(apiVal);
      setIsFetchList(true);
      setSelectedToys([]);
      notification.success({
        message: "Success",
        description: "Selected toys updated successfully!",
        duration: 5, // saniye cinsinden
        showProgress: true, // progress bar göster
        pauseOnHover: true, // hover'da duraklat
        placement: "topRight", // konum (isteğe bağlı)
      });
    } catch {
      notification.error({
        message: "Error",
        description: "Selectod toys could not be updated!",
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    const fetchRarityTypes = async () => {
      try {
        const fetchedRarityTypes = await GetAllRarityTypesAPI();
        setRarityTypes(
          fetchedRarityTypes.map((rt) => {
            return {
              value: rt.id,
              label: rt.name,
              object: rt,
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    const fetchToyTypes = async () => {
      try {
        const fetchedToyTypes = await GetAllToyTypesAPI();
        setToyTypes(
          fetchedToyTypes.map((tt) => {
            return {
              value: tt.id,
              label: tt.name,
              object: tt,
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchRarityTypes();
    fetchToyTypes();
  }, []);

  const handleSelection = (item) => {
    if (selectedToys.includes(item)) {
      setSelectedToys(selectedToys.filter((x) => x.id !== item.id));
    } else {
      setSelectedToys([...selectedToys, item]);
    }
  };

  const clearSelection = () => {
    setSelectedToys([]);
  };

  useEffect(() => {
    console.log(toys)
  },[toys])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {selectedToys.length ? (
        <>
          <ReusableCheckedCard
            selectedItems={selectedToys}
            handleSelection={handleSelection}
            clearSelection={clearSelection}
            handleFinish={handleFinish}
            title={`Selected Toys`}
            updateButtonText="Update Selected Toys"
            clearButtonText="Clear All"
            updateFormTitle="Update Form"
            formFields={formFields}
            selectOptions={{
              rarityTypes: rarityTypes,
              toyTypes: toyTypes,
            }}
            leftCardFlex={3}
            rightCardFlex={2}
            showUpdateForm={true}
            itemDisplayFunction={(toy) =>
              `${toy.name} | $${toy.price} | ${toy.rarity.name} | ${toy.toyType.name}`
            }
          />
        </>
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
          gap:"16px"
        }}
      >
        <ToyList
          handleSelection={handleSelection}
          selectedToys={selectedToys}
          setSelectedToys={setSelectedToys}
          isFetchList={isFetchList}
          setIsFetchList={setIsFetchList}
          toys={toys}
          setToys={setToys}
          handleEdit={handleEdit}
        />
        {/*handleEdit*/}
        {
          editingToy != null ?
          <Card
          style={{
            display:"flex",
            flexDirection:"column",
            width:"100%",
            maxHeight:"100%",
            marginTop:"70px",
            marginBottom:"70px",
            overflow:"hidden",
            flexShrink:1,
          }}
        >
          <div
            style={{
              display:"flex",
              flexDirection:"row",
              justifyContent:"space-between"
            }}
          >
            <Typography.Title>{editingToy.name}</Typography.Title>
            <Button style={{display:"flex", justifySelf:"flex-end"}} onClick={() => handleEdit(null)}>Close</Button>
          </div>
          <Divider></Divider>
          <div
          style={{
            display:"flex",
            justifyContent:"center",
            alignContent:"center"
          }}
          >
          <Carousel style={{display:"flex", width:"300px", }} arrows infinite={false}>
            {editingToy.imageUrls.map(img => 
              <img src={img}></img>
            )}
          </Carousel>
          </div>
        </Card>
        : null
        }
      </div>
    </div>
  );
};

export default ToyMainPage;

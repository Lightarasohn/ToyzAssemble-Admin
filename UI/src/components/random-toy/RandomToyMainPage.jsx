import { Button, Card, Carousel, List, Typography } from "antd";
import { useEffect, useState } from "react";
import GetAllPackagesAPI from "../../api/package/GetAllPackagesAPI";
import GetAllPackageRaritiesByPackageIdAPI from "../../api/package-rarity/GetAllPackageRaritiesByPackageIdAPI";
import GetRandomToyAPI from "../../api/random-toy/GetRandomToyAPI";

const RandomToyMainPage = () => {
  const [packages, setPackages] = useState([]);
  const [pickedToy, setPickedToy] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const fetchedPackages = await GetAllPackagesAPI();

        const resolvedPackages = await Promise.all(
          fetchedPackages.map(async (data) => {
            const packageRarities = data.packageRarityTypes;
            return {
              package: data,
              rarities: packageRarities
                .filter((item) => !item.deleted)
                .map((item) => ({
                  rarity: item.rarityType,
                  ratio: item.ratio,
                })),
            };
          })
        );

        setPackages(resolvedPackages);
      } catch (err) {
        console.error("Paketler çekilirken hata:", err);
      }
    };

    fetchPackages();
  }, []);

  const handleRandomButton = async (packageId) => {
    const toy = await GetRandomToyAPI(packageId);
    setPickedToy(toy);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "flex-start",
      }}
    >
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        style={{
          minWidth: "400px",
        }}
        dataSource={packages}
        renderItem={(item) => {
          // oranların toplamı
          const ratioSum = item.rarities.reduce((sum, x) => sum + x.ratio, 0);
          const ratioConvertRatio = ratioSum > 0 ? 100 / ratioSum : 0;

          return (
            <List.Item key={item.package.id}>
              <Card
                title={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignContent: "center",
                      minWidth: "300px",
                    }}
                  >
                    <span>{item.package.name} | ${item.package.price}</span>
                    <Button
                      type="primary"
                      onClick={() => handleRandomButton(item.package.id)}
                    >
                      RANDOM
                    </Button>
                  </div>
                }
              >
                {item.rarities.map((rarityRatio, index) => (
                  <div key={index}>
                    {rarityRatio.rarity.name}: {rarityRatio.ratio} |{" "}
                    {(rarityRatio.ratio * ratioConvertRatio).toFixed(2)}%
                  </div>
                ))}
              </Card>
            </List.Item>
          );
        }}
      />
      {pickedToy != null ? (
        <Card
          title={pickedToy.toy.name}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            gap: "16px",
          }}
        >
          <Carousel
            style={{
              display: "flex",
              width: "300px",
              gap: "16px",
              justifySelf: "center",
              alignSelf: "center",
            }}
            arrows
            infinite={false}
          >
            {pickedToy.toy.imageUrls && pickedToy.toy.imageUrls.length > 0 ? (
              pickedToy.toy.imageUrls.map((img, idx) => (
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
                    alt={`${pickedToy.toy.name.toLowerCase()}-${idx}`}
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
                <Typography.Text type="secondary">
                  No Images To Display
                </Typography.Text>
              </div>
            )}
          </Carousel>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              maxLines: 3,
              gap: "16px",
            }}
          >
            <Card>Id: {pickedToy.toy.id}</Card>
            <Card>Price: ${pickedToy.toy.price}</Card>
            <Card>Rarity: {pickedToy.toy.rarity.name}</Card>
            <Card>Toy Type: {pickedToy.toy.toyType.name}</Card>
            <Card>Probability: {pickedToy.probability}%</Card>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default RandomToyMainPage;

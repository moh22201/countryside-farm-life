import { createFileRoute } from "@tanstack/react-router";
import a_animal_worker from "@/assets/animal-worker.png";
import a_auto_watering from "@/assets/auto-watering.png";
import a_bakery from "@/assets/bakery.png";
import a_battery from "@/assets/battery.png";
import a_builder_house from "@/assets/builder-house.png";
import a_cafe from "@/assets/cafe.png";
import a_cake_factory from "@/assets/cake-factory.png";
import a_candy_factory from "@/assets/candy-factory.png";
import a_cart from "@/assets/cart.png";
import a_chicken_empty from "@/assets/chicken-empty.png";
import a_chicken from "@/assets/chicken.png";
import a_chocolate_factory from "@/assets/chocolate-factory.png";
import a_construction_worker from "@/assets/construction-worker.png";
import a_cow_empty from "@/assets/cow-empty.png";
import a_cow from "@/assets/cow.png";
import a_cow1 from "@/assets/cow1.png";
import a_delivery_truck from "@/assets/delivery-truck.png";
import a_duck_house from "@/assets/duck-house.png";
import a_fabric_plant from "@/assets/fabric-plant.png";
import a_factory_worker from "@/assets/factory-worker.png";
import a_farm_house from "@/assets/farm-house.png";
import a_farm_tractor from "@/assets/farm-tractor.png";
import a_farmer from "@/assets/farmer.png";
import a_feed_factory from "@/assets/feed-factory.png";
import a_feed_trough from "@/assets/feed-trough.png";
import a_food_storage from "@/assets/food-storage.png";
import a_forklift from "@/assets/forklift.png";
import a_freight_pier from "@/assets/freight-pier.png";
import a_fuel_barrel from "@/assets/fuel-barrel.png";
import a_fuel_storage from "@/assets/fuel-storage.png";
import a_general_depot from "@/assets/general-depot.png";
import a_goods_storage from "@/assets/goods-storage.png";
import a_grain_mill from "@/assets/grain-mill.png";
import a_grain_silo from "@/assets/grain-silo.png";
import a_hen from "@/assets/hen.png";
import a_iron_mine from "@/assets/iron-mine.png";
import a_lumber_mill from "@/assets/lumber-mill.png";
import a_lumber_yard from "@/assets/lumber-yard.png";
import a_lumberjack_house from "@/assets/lumberjack-house.png";
import a_mine from "@/assets/mine.png";
import a_miner_cart from "@/assets/miner-cart.png";
import a_miner_shovel from "@/assets/miner-shovel.png";
import a_miner from "@/assets/miner.png";
import a_nuclear from "@/assets/nuclear.png";
import a_power_plant from "@/assets/power-plant.png";
import a_quad from "@/assets/quad.png";
import a_sheep_empty from "@/assets/sheep-empty.png";
import a_sheep from "@/assets/sheep.png";
import a_sheep1 from "@/assets/sheep1.png";
import a_steel_mill from "@/assets/steel-mill.png";
import a_tractor_trailer from "@/assets/tractor-trailer.png";
import a_trade_depot from "@/assets/trade-depot.png";
import a_trade_pier from "@/assets/trade-pier.png";
import a_transport_worker from "@/assets/transport-worker.png";
import a_wind_turbine from "@/assets/wind-turbine.png";
import a_winery from "@/assets/winery.png";
import a_wood_storage from "@/assets/wood-storage.png";
import a_worker_house from "@/assets/worker-house.png";

const assetUrls = {
  "animal-worker": a_animal_worker,
  "auto-watering": a_auto_watering,
  "bakery": a_bakery,
  "battery": a_battery,
  "builder-house": a_builder_house,
  "cafe": a_cafe,
  "cake-factory": a_cake_factory,
  "candy-factory": a_candy_factory,
  "cart": a_cart,
  "chicken-empty": a_chicken_empty,
  "chicken": a_chicken,
  "chocolate-factory": a_chocolate_factory,
  "construction-worker": a_construction_worker,
  "cow-empty": a_cow_empty,
  "cow": a_cow,
  "cow1": a_cow1,
  "delivery-truck": a_delivery_truck,
  "duck-house": a_duck_house,
  "fabric-plant": a_fabric_plant,
  "factory-worker": a_factory_worker,
  "farm-house": a_farm_house,
  "farm-tractor": a_farm_tractor,
  "farmer": a_farmer,
  "feed-factory": a_feed_factory,
  "feed-trough": a_feed_trough,
  "food-storage": a_food_storage,
  "forklift": a_forklift,
  "freight-pier": a_freight_pier,
  "fuel-barrel": a_fuel_barrel,
  "fuel-storage": a_fuel_storage,
  "general-depot": a_general_depot,
  "goods-storage": a_goods_storage,
  "grain-mill": a_grain_mill,
  "grain-silo": a_grain_silo,
  "hen": a_hen,
  "iron-mine": a_iron_mine,
  "lumber-mill": a_lumber_mill,
  "lumber-yard": a_lumber_yard,
  "lumberjack-house": a_lumberjack_house,
  "mine": a_mine,
  "miner-cart": a_miner_cart,
  "miner-shovel": a_miner_shovel,
  "miner": a_miner,
  "nuclear": a_nuclear,
  "power-plant": a_power_plant,
  "quad": a_quad,
  "sheep-empty": a_sheep_empty,
  "sheep": a_sheep,
  "sheep1": a_sheep1,
  "steel-mill": a_steel_mill,
  "tractor-trailer": a_tractor_trailer,
  "trade-depot": a_trade_depot,
  "trade-pier": a_trade_pier,
  "transport-worker": a_transport_worker,
  "wind-turbine": a_wind_turbine,
  "winery": a_winery,
  "wood-storage": a_wood_storage,
  "worker-house": a_worker_house,
};

const assetMapKeys = Object.fromEntries(Object.entries({"Farm House":"farm-house","Lumberjack House":"lumberjack-house","Farm Tractor":"farm-tractor","Lumber Yard":"lumber-yard","Wood Shed":"wood-storage","Silo":"grain-silo","Storehouse":"goods-storage","Warehouse":"general-depot","Pantry":"food-storage","Fuel Storage":"fuel-storage","Bakery":"bakery","Cakery":"cake-factory","Candy Shop":"candy-factory","Chocolate Shop":"chocolate-factory","Windmill":"grain-mill","Feed Mill":"feed-factory","Winery":"winery","Cafe":"cafe","Chicken Coop":"chicken","Sheep Pen":"sheep","Milk Barn":"cow","Duck House":"duck-house","Trough":"feed-trough","Iron Mine":"iron-mine","Lumber Mill":"lumber-mill","Fabric Plant":"fabric-plant","Steel Mill":"steel-mill","Power Plant":"power-plant","Nuclear Power":"nuclear","Wind Turbine":"wind-turbine","Trade Dock":"trade-pier","Trade Depot":"trade-depot","Forklift":"forklift","Builder House":"builder-house","Worker House":"worker-house","Sales Truck":"delivery-truck"}).map(([name, file]) => [name, assetUrls[file]]));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "قريتي – المرحلة ١" },
      { name: "description", content: "لعبة قريتي التفاعلية" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        height: "100dvh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#8fbf78",
      }}
    >
      <iframe
        title="قريتي – المرحلة ١"
        src={`./village.html?assets=${encodeURIComponent(JSON.stringify(assetMapKeys))}`}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow="fullscreen"
      />
    </main>
  );
}

import { test } from "node:test";
import { strict as assert } from "node:assert";
import { referenceTariffRows, validateReferenceTariffs } from "./package-tariffs";

test("Blue bouquet reference prices are 75, 100 and 150–250 USD for a group of 2–5", () => {
  assert.deepEqual(referenceTariffRows({ economy_price: 75, vip_price: 100, group_price_min: 150, group_price_max: 250, group_people_min: 2, group_people_max: 5, currency: "USD" }), [{ kind: "economy", amount: "75 USD" }, { kind: "vip", amount: "100 USD" }, { kind: "group", amount: "150–250 USD", people: "2–5" }]);
});
test("Red bouquet reference prices are 70, 80 and 120–200 USD", () => {
  assert.deepEqual(referenceTariffRows({ economy_price: 70, vip_price: 80, group_price_min: 120, group_price_max: 200, currency: "USD" }).map((r) => r.amount), ["70 USD", "80 USD", "120–200 USD"]);
});
test("Green bouquet reference prices are 75, 100 and 150–250 USD", () => {
  assert.deepEqual(referenceTariffRows({ economy_price: 75, vip_price: 100, group_price_min: 150, group_price_max: 250, currency: "USD" }).map((r) => r.amount), ["75 USD", "100 USD", "150–250 USD"]);
});
test("Group quote stays a total range instead of being multiplied by group size", () => {
  assert.equal(referenceTariffRows({ group_price_min: 150, group_price_max: 250, group_people_min: 2, group_people_max: 5 })[0]?.amount, "150–250 USD");
});
test("Invalid group bounds and negative prices cannot be saved", () => {
  assert.ok(validateReferenceTariffs({ group_price_min: 250, group_price_max: 150 }));
  assert.ok(validateReferenceTariffs({ group_price_min: 150 }));
  assert.ok(validateReferenceTariffs({ economy_price: -1 }));
  assert.ok(validateReferenceTariffs({ group_people_min: 5, group_people_max: 2 }));
  assert.equal(validateReferenceTariffs({ economy_price: 75, vip_price: 100, group_price_min: 150, group_price_max: 250, group_people_min: 2, group_people_max: 5 }), null);
});
import React, { useState, useEffect } from "react";
import {
  Screen,
  Navigator,
  Section,
  List,
  reactExtension,
  Text,
  Button,
  TextField,
  ScrollView,
  useCartSubscription,
  useApi,
} from "@shopify/ui-extensions-react/point-of-sale";

async function fetchProductData(items, api) {
  const itemsVariantIds = items.map((item) => item.variantId);
  const res = await api.productSearch.fetchProductVariantsWithIds(
    itemsVariantIds
  );
  return res.fetchedResources;
}

function combineCartItemsWithProductData(cartItems, productData) {
  const enrichedCartItems = cartItems.map((item) => {
    const variant = productData.find(
      (variant) => variant.id === item.variantId
    );
    return {
      ...item,
      image:
        variant?.image?.length > 0
          ? variant.image
          : variant.product.featuredImage,
      options: variant?.options,
    };
  });
  return enrichedCartItems;
}

function lineItemsToListComponent(items, api, setSelectedItem) {
  return items.map((item) => ({
    id: item.uuid,
    onPress: () => {
      api.navigation.navigate("Embroidery Selection");
      setSelectedItem(item.uuid);
    },
    leftSide: {
      label: item?.title,
      image: { source: item?.image },
      subtitle: [
        { content: item?.options?.[0]?.value, color: "TextHighlight" },
      ],
      badges: [],
    },
    rightSide: {
      label: "Add Embroidery",
      showChevron: true,
    },
  }));
}

const Modal = () => {
  const api = useApi();
  const cart = useCartSubscription();
  const [productData, setProductData] = useState([]);
  const [enrichedCartItems, setEnrichedCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [placement, setPlacement] = useState('');
  const [monogram, setMonogram] = useState('');


  useEffect(() => {
    async function getProductData() {
      const productDataResponse = await fetchProductData(cart.lineItems, api);
      setProductData(productDataResponse);
    }
    getProductData();
  }, []);

  useEffect(() => {
    if (productData.length > 0) {
      const updatedCartItems = combineCartItemsWithProductData(
        cart.lineItems,
        productData
      );
      setEnrichedCartItems(updatedCartItems);
    } else {
      setEnrichedCartItems(cart.lineItems);
    }
  }, [productData]);

  const listItems = lineItemsToListComponent(enrichedCartItems, api, setSelectedItem);

  return (
    <Navigator>
      <Screen name="Embroidery" title="Embroidery">
        <ScrollView>
          <Section title="Please select an item to add a embroidery to">
            <List data={listItems} imageDisplayStrategy="always" />
          </Section>
        </ScrollView>
      </Screen>
      <Screen name="Embroidery Selection" title="Embroidery Selection">
        <ScrollView>
          <Section title="Embroidery Options">
          <TextField
            label="Placement"
            placeholder="Left Chest"
            required={true}
            value={placement}
            onChange={setPlacement}
          />
          <TextField
            label="Monogram"
            placeholder="N.D.F"
            required={true}
            value={monogram}
            onChange={setMonogram}
          />
          <Button
            title="Add Embroidery"
            type="primary"
            onPress={() => {
              try {
                api.cart.addLineItemProperties(selectedItem, {
                  Embroidery_Placement: placement,
                  Embroidery_Monogram: monogram,
                });
                api.toast.show("Embroidery added to item");
              } catch (error) {
                console.error(error);
                api.toast.show(`Error adding embroidery to item`);
              }
            }}
          />
          </Section>
        </ScrollView>
      </Screen>
    </Navigator>
  );
};

export default reactExtension("pos.home.modal.render", () => {
  return <Modal />;
});

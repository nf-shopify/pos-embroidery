# Embroidery Customizer

A Shopify POS extension that enables merchants to offer personalized embroidery customization services directly at the point of sale. This extension-only app allows staff to capture embroidery details (placement and monogram) for cart items during checkout.

## Overview

The Embroidery Customizer integrates seamlessly into Shopify POS, providing:

- **Home Screen Tile**: A button on the POS home screen that opens the customization interface
- **Multi-Screen Modal**: An intuitive interface for selecting items and adding embroidery details
- **Line Item Properties**: Captures and stores embroidery specifications as line item properties in the cart

## Features

### 1. POS Home Tile
- Displays "Embroidery Customizer" button on the POS home screen
- Shows contextual subtitle: "Add Embroidery" or "No items in cart"
- Automatically enables/disables based on cart contents
- One-tap access to customization interface

### 2. Item Selection Screen
- Lists all items currently in the shopping cart
- Shows product images and variant options
- Allows staff to select which item needs embroidery
- Visual product preview for easy identification

### 3. Embroidery Customization Screen
- **Placement Field**: Capture where the embroidery should be placed (e.g., "Left Chest", "Back", "Sleeve")
- **Monogram Field**: Capture the text/initials to embroider (e.g., "N.D.F", "ABC")
- **Add Embroidery Button**: Saves customization to the selected cart item
- **Success/Error Feedback**: Toast notifications confirm action completion

### 4. Data Persistence
- Embroidery details are saved as line item properties:
  - `Embroidery_Placement`: Stores the placement value
  - `Embroidery_Monogram`: Stores the monogram text
- Properties carry through to order fulfillment
- Visible in Shopify Admin order details

## Project Structure

```
pos-embroidery/
├── extensions/
│   └── pos-embroidery/
│       ├── src/
│       │   ├── Tile.jsx          # POS home screen tile component
│       │   └── Modal.jsx         # Embroidery customization modal
│       ├── package.json          # Extension dependencies
│       └── shopify.extension.toml # Extension configuration
├── package.json                  # Root project configuration
├── shopify.app.toml             # App configuration
└── README.md                    # This file
```

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (Download from [nodejs.org](https://nodejs.org/en/download/))
2. **Shopify Partner Account** ([Create account](https://partners.shopify.com/signup))
3. **Development Store** with POS enabled:
   - [Development Store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or
   - [Shopify Plus Sandbox Store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store)
4. **Shopify CLI** (Installed automatically with this project)

## Installation

Clone this repository and install dependencies:

### Using npm:
```bash
git clone <repository-url>
cd pos-embroidery
npm install
```

### Using yarn:
```bash
git clone <repository-url>
cd pos-embroidery
yarn install
```

### Using pnpm:
```bash
git clone <repository-url>
cd pos-embroidery
pnpm install
```

## Local Development

Start the development server:

### Using npm:
```bash
npm run dev
```

### Using yarn:
```bash
yarn dev
```

### Using pnpm:
```bash
pnpm run dev
```

The Shopify CLI will:
1. Connect to your Partner Dashboard app
2. Generate a development URL
3. Open your browser for authorization
4. Start watching for file changes
5. Hot-reload your extension in POS

**Testing on POS:**
- Install the Shopify POS app on your mobile device or tablet
- Log in to your development store
- The "Kindthread Customizer" tile will appear on the home screen

## How It Works

### Technical Implementation

#### Tile Component (`Tile.jsx`)
```javascript
// Monitors cart state in real-time
const cart = useCartSubscription();
const enabled = cart.lineItems.length;

// Opens modal when pressed
onPress={() => {api.action.presentModal()}}
```

#### Modal Component (`Modal.jsx`)

**1. Product Data Enrichment**
- Fetches variant data using `api.productSearch.fetchProductVariantsWithIds()`
- Enriches cart items with product images and variant options
- Displays items with visual preview

**2. Multi-Screen Navigation**
- **Screen 1**: Item selection list
- **Screen 2**: Embroidery customization form
- Navigator manages screen transitions

**3. Data Capture & Storage**
```javascript
api.cart.addLineItemProperties(selectedItem, {
  Embroidery_Placement: placement,
  Embroidery_Monogram: monogram,
});
```

### API Integration

This extension uses the Shopify UI Extensions API (`@shopify/ui-extensions-react/point-of-sale`):

- **Cart API**: `useCartSubscription()` - Real-time cart monitoring
- **Navigation API**: `api.navigation.navigate()` - Screen transitions
- **Product Search API**: `fetchProductVariantsWithIds()` - Product data retrieval
- **Toast API**: `api.toast.show()` - User feedback notifications
- **Line Item API**: `addLineItemProperties()` - Save customization data

## Configuration

### App Configuration (`shopify.app.toml`)
```toml
name = "Threadkind Customizer"
handle = "threadkind-customizer"
client_id = "0351e38550ed2226f416e6314c957c55"
application_url = "https://shopify.dev/apps/default-app-home"
embedded = true

[pos]
embedded = true
```

### Extension Configuration (`extensions/pos-embroidery/shopify.extension.toml`)
- **Extension Type**: UI Extension
- **API Version**: 2025-04
- **Targets**:
  - `pos.home.tile.render` → Tile.jsx
  - `pos.home.modal.render` → Modal.jsx

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build extension for production |
| `npm run deploy` | Deploy extension to Shopify |
| `npm run info` | Display app information |
| `npm run generate` | Generate new app components |

## Deployment

Deploy your extension to production:

```bash
npm run deploy
```

Follow the CLI prompts to:
1. Select deployment target (production)
2. Confirm extension configuration
3. Push to Shopify

After deployment, install the app on your production store from the Partner Dashboard.

## Customization

### Modifying Embroidery Fields

Edit `/extensions/pos-embroidery/src/Modal.jsx` to add or modify fields:

```javascript
// Add new field
const [color, setColor] = useState('');

<TextField
  label="Thread Color"
  placeholder="Navy Blue"
  value={color}
  onChange={setColor}
/>

// Save to line item properties
api.cart.addLineItemProperties(selectedItem, {
  Embroidery_Placement: placement,
  Embroidery_Monogram: monogram,
  Embroidery_Color: color,  // New field
});
```

### Changing Tile Appearance

Edit `/extensions/pos-embroidery/src/Tile.jsx` to customize the home screen tile:

```javascript
<Tile
  title="Your Custom Title"
  subtitle="Your custom subtitle"
  // Add icon, change colors, etc.
/>
```

## Troubleshooting

### Extension Not Appearing in POS
1. Ensure POS is enabled in `shopify.app.toml` (`[pos] embedded = true`)
2. Verify extension targets in `shopify.extension.toml`
3. Restart the POS app completely
4. Check development store has POS channel enabled

### Cart Items Not Loading
- Verify items are in the cart before opening the extension
- Check browser console for API errors
- Ensure product variants have valid IDs

### Line Item Properties Not Saving
- Confirm property keys don't contain spaces (use underscores)
- Check API permissions in Partner Dashboard
- Verify toast notifications for error messages

## Developer Resources

- [Shopify POS UI Extensions](https://shopify.dev/docs/api/pos-ui-extensions)
- [UI Extensions React Components](https://shopify.dev/docs/api/pos-ui-extensions/components)
- [Extension-Only Apps](https://shopify.dev/docs/apps/build/app-extensions/build-extension-only-app)
- [Shopify CLI Documentation](https://shopify.dev/docs/apps/tools/cli)
- [Line Item Properties](https://shopify.dev/docs/api/pos-ui-extensions/apis/cart#methods)

## License

UNLICENSED - Private project

## Author

neilsonflemming

---

## Version History

### 1.0.0 (Current)
- Initial release
- POS home tile integration
- Item selection interface
- Embroidery customization (placement + monogram)
- Line item properties storage

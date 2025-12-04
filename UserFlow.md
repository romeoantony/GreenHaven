# User Flow Documentation

This document defines the capabilities and workflows for different user roles in the GreenHaven application.

## Entities

### 1. User (Customer)

A standard user who browses and purchases plants.

**Capabilities:**

- **Browse Products**: View all available plants, filter by category, light requirements, etc.
- **View Product Details**: See detailed information about a specific plant.
- **Manage Cart**: Add items to cart, update quantities, remove items.
- **Checkout**: Place an order for items in the cart.
- **View Order History**: See a list of past orders and their status.
- **Manage Profile**: Update personal information (Name, Email, Address).

**Key Workflows:**

1.  **Purchase Flow**: Browse -> Add to Cart -> Checkout -> Payment -> Order Confirmation.
2.  **History Flow**: Profile -> My Orders -> View Order Details.

### 2. Admin

A privileged user who manages the store inventory and oversees orders.

**Capabilities:**

- **All User Capabilities**: Admins can also browse and purchase plants like a normal user.
- **Manage Inventory**:
  - **Add Plant**: Create new plant listings with details and images.
  - **Edit Plant**: Update existing plant details (price, stock, description).
  - **Delete Plant**: Remove plants from the store.
- **View All Orders**: Access a dashboard showing orders from ALL users.
- **Order Identification**: When placing an order (e.g., on behalf of a client), Admins can add a custom "Order Reference" or "Customer Name" to track it easily.

**Key Workflows:**

1.  **Inventory Management**: Admin Dashboard -> Plants Tab -> Add/Edit/Delete.
2.  **Order Oversight**: Admin Dashboard -> Orders Tab -> View All Orders.
3.  **Client Order**: Shop -> Add to Cart -> Checkout -> Enter "Client Name" in Reference field -> Payment.

## Permissions Matrix

| Feature              | User |                           Admin                            |
| :------------------- | :--: | :--------------------------------------------------------: |
| Browse Shop          |  ✅  |                             ✅                             |
| Add to Cart          |  ✅  |                             ✅                             |
| Place Order          |  ✅  |                             ✅                             |
| View Own Orders      |  ✅  |                             ✅                             |
| **View All Orders**  |  ❌  |                             ✅                             |
| **Add/Edit Plants**  |  ❌  |                             ✅                             |
| **Delete Plants**    |  ❌  |                             ✅                             |
| **Custom Order Ref** |  ❌  | ✅ (UI enabled for all, but primarily for Admin use cases) |

> [!NOTE]
> Currently, the "Order Reference" field is visible to all users during checkout, allowing anyone to add a note or reference to their order.

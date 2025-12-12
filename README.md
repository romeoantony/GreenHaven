# GreenHaven 🌿

![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

GreenHaven is a modern e-commerce platform dedicated to bringing nature indoors. We offer a curated collection of indoor plants, providing a seamless shopping experience for plant enthusiasts with a beautiful, botanical-inspired design.

## 🌟 Live Demo

- **Frontend**: [https://orange-river-0ae9c2100.3.azurestaticapps.net/](https://orange-river-0ae9c2100.3.azurestaticapps.net/)

## 📸 Screenshots

### Homepage & Plant Catalog

![Homepage with hero section and plant grid](https://raw.githubusercontent.com/romeoantony/GreenHaven/main/.github/screenshots/homepage_hero_grid.png)

### Plant Grid View

![Scrolled plant catalog showing variety of plants](https://raw.githubusercontent.com/romeoantony/GreenHaven/main/.github/screenshots/homepage_scrolled_grid.png)

### Plant Details Modal

![Plant details modal with care information](https://raw.githubusercontent.com/romeoantony/GreenHaven/main/.github/screenshots/plant_details_modal.png)

## Project Structure

The project is divided into two main components:

- **[GreenHaven.UI](./GreenHaven.UI)**: The frontend application built with React, Vite, and Tailwind CSS. Features a modern, botanical UI with smooth animations and responsive design.
- **[GreenHaven.API](./GreenHaven.API)**: The backend API built with .NET Core. Handles data management, authentication, and business logic with role-based access control.

## ✨ Key Features

### Shopping Experience

- **Browse Collection**: Explore a wide variety of indoor plants with detailed descriptions and care instructions
- **Smart Filtering**: Easily find plants based on category, light requirements, difficulty, and pet-friendliness
- **Category Pills**: Quick-filter plants with one-click category buttons
- **Search Functionality**: Real-time plant search with instant results
- **Product Details Modal**: Beautiful modal with plant care information and add-to-cart functionality

### User Features

- **User Accounts**: Create an account to track orders and manage your profile
- **Order History**: View detailed order history with product information
- **Shopping Cart**: Smooth cart drawer with animated item management
- **Secure Checkout**: Protected payment flow with authentication
- **Messaging System**: Real-time support chat widget for direct communication with admins

### Admin Features

- **Admin Dashboard**: Comprehensive dashboard for managing plants, orders, and users
- **Plant Management**: Add, edit, and delete plants with image uploads
- **Order Management**: View and manage all customer orders
- **User Management**: Manage user accounts and roles
- **Role-Based Access**: Secure admin routes with proper authorization
- **Toast Notifications**: Real-time feedback for actions like registration and deletion

### User Experience

- **Auto-Login**: Seamless registration process with automatic login
- **Already Logged In Page**: Prevents logged-in users from accessing login/register pages

### Design & UX

- **Modern Botanical UI**: Clean, contemporary design with forest green color palette
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Outlined Button Style**: Modern, minimal button design throughout
- **Enhanced Typography**: Large, bold headings with excellent visual hierarchy
- **Category Pills**: Quick filtering with active state indicators

## 🚀 Getting Started

To get the project running locally, you will need to set up both the frontend and backend.

> [!NOTE]
> For detailed architecture, debugging tips, and deployment instructions, please refer to the [**Developer Documentation**](./DEVELOPER_README.md).

### Prerequisites

- Node.js (v16 or higher)
- .NET 8 SDK
- SQL Server LocalDB or SQL Server

### Backend Setup

1. Navigate to `GreenHaven.API`
2. Update connection string in `appsettings.json` if needed
3. Run migrations: `dotnet ef database update`
4. Start the server: `dotnet run`

### Frontend Setup

1. Navigate to `GreenHaven.UI`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser to `http://localhost:5174`

## ☁️ Deployment

For detailed deployment instructions (Azure App Service, Environment Variables, etc.), please see the [**Deployment Section**](./DEVELOPER_README.md#%EF%B8%8F-deployment) in the Developer README.

## 🛠️ Technologies Used

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **React Router** - Routing
- **Lucide React** - Icon library

### Backend

- **.NET 8** - Web framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **JWT Authentication** - Secure authentication
- **ASP.NET Core Identity** - User management

## 🎨 Design Philosophy

GreenHaven embraces a modern botanical aesthetic with:

- **Forest Green Palette**: Deep, natural greens that evoke growth and nature
- **Clean White Spaces**: Ample breathing room for content
- **Bold Typography**: Large, serif headings for impact
- **Smooth Animations**: Delightful micro-interactions throughout
- **Minimal Design**: Focus on content with clean, uncluttered layouts

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Admin and User roles with proper access control
- **Protected Routes**: Authentication required for checkout and profile pages
- **Secure Admin Access**: Admin dashboard only accessible to authorized users
- **Already Logged In Page**: Prevents logged-in users from accessing login/register pages

## 📱 Responsive Features

- **Mobile-First Design**: Optimized for mobile devices
- **Adaptive Layouts**: Responsive grid systems for all screen sizes
- **Mobile Filter Drawer**: Slide-out filter panel for mobile
- **Touch-Friendly**: Large tap targets and smooth touch interactions

## 🗺️ Future Roadmap

- [ ] **User Reviews**: Allow customers to leave reviews and ratings for plants
- [ ] **Wishlist**: Enable users to save favorite plants
- [ ] **Payment Gateway Integration**: Stripe/PayPal integration for real transactions
- [ ] **Email Notifications**: Order confirmations and updates
- [ ] **Plant Care Reminders**: Notifications for watering and care schedules
- [ ] **Social Sharing**: Share favorite plants on social media
- [ ] **Advanced Search**: Filters for size, price range, and more

## 📄 License

This project is for educational and portfolio purposes.

## 👨‍💻 Author

**Romeo Antony**

- GitHub: [@romeoantony](https://github.com/romeoantony)

---

Made with 🌱 and ❤️

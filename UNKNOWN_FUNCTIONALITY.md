# Unknown/Missing Functionality Tracking

This document tracks functionality that cannot be recreated from the frontend code alone and will need clarification or implementation.

## 🔴 CRITICAL UNKNOWNS - Backend API Structure

### Product Management
- **Product sync functionality** - What external API does "Sync Products" connect to?
- **CSV export format** - What columns and data structure should be exported?
- **Product approval workflow** - How does the approval process work?
- **Pricing logic** - How are wholesale vs override prices calculated and applied?
- **Stock management** - How is inventory tracked and updated?
- **Product image handling** - How are product images uploaded and stored?

### User Management
- **User roles and permissions** - What specific roles exist beyond "admin" and "member"?
- **User registration workflow** - How are new users onboarded?
- **Membership status logic** - What determines membership status changes?
- **Account credit system** - How are credits earned, spent, and managed?
- **Reseller functionality** - What special features do resellers have?
- **User profile updates** - How to update user information in the users table?

### Request Management
- **Request assignment logic** - How are requests automatically assigned?
- **Request workflow** - What triggers status changes from pending → in_progress → completed?
- **Notification system** - When and how are users notified of request updates?
- **Request approval process** - Who can approve/reject requests?
- **Request to order conversion** - How are approved requests converted to orders?

### Invoice Management
- **Invoice generation logic** - How are invoices automatically created from orders/requests?
- **Tax calculation** - How are tax amounts calculated based on location/rules?
- **Payment integration** - How does payment processing work with Stripe?
- **Invoice templates** - What does the PDF invoice template look like?
- **Automatic invoice sending** - When and how are invoices sent to customers?
- **PDF generation** - How are invoice PDFs generated and downloaded?

### Order Management
- **Order creation workflow** - How are orders created from requests/quotes?
- **Payment processing** - Integration with payment gateways
- **Order fulfillment** - How does the fulfillment process work?
- **Shipping calculation** - How are shipping costs calculated?
- **Order status automation** - What triggers automatic status updates?
- **Order line items** - How are order items structured and managed?

### Shipment Management
- **Carrier integration** - How does tracking number generation work?
- **Shipping label generation** - Integration with shipping providers
- **Delivery tracking** - How are delivery updates received and processed?
- **Return processing** - How are returns handled?
- **External tracking links** - How to generate carrier-specific tracking URLs?

### Message System
- **Message creation** - How are system messages automatically generated?
- **Message threading** - How are related messages grouped?
- **Message archiving** - How does the archive system work?
- **Reply functionality** - How are message replies handled?
- **Message notifications** - How are users notified of new messages?

## 🟡 MEDIUM PRIORITY UNKNOWNS

### Authentication & Security
- **Password reset flow** - Email templates and reset logic
- **Email verification** - Verification email templates and flow
- **Session management** - Token refresh and expiration handling
- **Role-based access control** - Detailed permission matrix
- **Password change functionality** - How to update user passwords

### Data Relationships
- **Product-Order relationships** - How are order line items structured?
- **Customer data management** - How is customer information stored and updated?
- **Audit logging** - What actions are logged and how?
- **Data synchronization** - How is data kept in sync between tables?

### Business Logic
- **Pricing rules** - Complex pricing logic based on customer type, volume, etc.
- **Inventory management** - Stock level tracking and low stock alerts
- **Reporting** - What reports are generated and how?
- **Automated workflows** - What processes are automated and how?

## 🟢 LOW PRIORITY UNKNOWNS

### UI/UX Details
- **Email templates** - Design and content of system emails
- **PDF generation** - Invoice and report PDF formatting
- **File upload limits** - Size and type restrictions for CSV imports
- **Data validation rules** - Specific validation requirements for each field
- **Error handling** - Specific error messages and user feedback

### Integration Details
- **External API rate limits** - How to handle API throttling
- **Caching strategy** - What data should be cached and for how long?
- **Real-time updates** - How are live updates handled (WebSockets, polling)?

## ✅ COMPLETED - What I CAN recreate from frontend

### UI Components & Layout
- ✅ Complete sidebar navigation with TCGWC branding
- ✅ User profile section with admin access and account credit display
- ✅ All page layouts and component structures
- ✅ Card-based layouts for all data displays
- ✅ Filter and search functionality (frontend filtering)
- ✅ Modal dialogs and forms
- ✅ Responsive design and styling

### Dashboard
- ✅ Stats cards showing counts for products, orders, invoices, shipments
- ✅ Spend History module with total spent calculation
- ✅ Message Center with unread message count and recent messages
- ✅ Proper dashboard layout matching original structure

### Product Catalog
- ✅ Product card display with images, pricing, availability
- ✅ Product filtering by category, distributor, availability, stock status
- ✅ Product search functionality
- ✅ Override pricing display logic
- ✅ Sample product badges
- ✅ Release date and order due date display

### Request System
- ✅ Request dialog with product details
- ✅ Request form with customer info, quantity, priority, message
- ✅ Request listing with status and priority badges
- ✅ Request filtering and search
- ✅ Request status color coding

### Invoice System
- ✅ Invoice listing with status badges
- ✅ Invoice filtering and search
- ✅ Invoice amount display (subtotal, tax, total)
- ✅ Due date and paid date display
- ✅ Invoice status color coding

### Order System
- ✅ Order listing with status and payment status badges
- ✅ Order filtering by status and payment status
- ✅ Order amount breakdown display
- ✅ Shipping and billing address display
- ✅ Order status color coding

### Shipment System
- ✅ Shipment listing with tracking numbers
- ✅ Shipment filtering by status and carrier
- ✅ Shipment status tracking display
- ✅ Shipment items display
- ✅ Delivery date tracking

### Message System
- ✅ Message listing with read/unread status
- ✅ Message filtering by type and read status
- ✅ Message type color coding
- ✅ Message content display

### Settings System
- ✅ Tabbed settings interface (Profile, Notifications, Security, Billing)
- ✅ Profile form with address fields
- ✅ Notification preference toggles
- ✅ Account credit and membership status display

### Admin Dashboard
- ✅ Tabbed admin interface (Products, Users, Requests, Invoices, Orders)
- ✅ Product management table with actions
- ✅ CSV import dialog with file upload
- ✅ Export and sync buttons (UI only)
- ✅ Admin request, invoice, and order management tables

## 📝 IMPLEMENTATION NOTES

### What's Working Now:
- Complete UI matching original GitHub repository
- All navigation and routing
- Data display and formatting
- Frontend filtering and search
- Form handling and validation
- Modal dialogs and interactions
- Status badges and color coding
- Responsive design
- Dashboard with Spend History and Message Center modules

### What Needs Backend Implementation:
- All CRUD operations beyond basic create/read
- Complex business logic and workflows
- External integrations (payment, shipping, etc.)
- File processing and PDF generation
- Email and notification systems
- Real-time updates and synchronization
- Advanced reporting and analytics

---

**Last Updated:** Dashboard fixed to match original structure
**Status:** Frontend structure now matches GitHub repository, tracking backend functionality gaps
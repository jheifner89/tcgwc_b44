# Unknown/Missing Functionality Tracking

This document tracks functionality that cannot be recreated from the frontend code alone and will need clarification or implementation.

## 🔴 CRITICAL UNKNOWNS - Backend API Structure

### Product Management
- **Product sync functionality** - What external API does "Sync Products" connect to?
- **CSV export format** - What columns and data structure should be exported?
- **Product approval workflow** - How does the approval process work?
- **Pricing logic** - How are wholesale vs override prices calculated and applied?
- **Stock management** - How is inventory tracked and updated?

### User Management
- **User roles and permissions** - What specific roles exist beyond "admin" and "member"?
- **User registration workflow** - How are new users onboarded?
- **Membership status logic** - What determines membership status changes?
- **Account credit system** - How are credits earned, spent, and managed?
- **Reseller functionality** - What special features do resellers have?

### Request Management
- **Request assignment logic** - How are requests automatically assigned?
- **Request workflow** - What triggers status changes from pending → in_progress → completed?
- **Notification system** - When and how are users notified of request updates?
- **Request approval process** - Who can approve/reject requests?

### Invoice Management
- **Invoice generation logic** - How are invoices automatically created from orders/requests?
- **Tax calculation** - How are tax amounts calculated based on location/rules?
- **Payment integration** - How does payment processing work with Stripe?
- **Invoice templates** - What does the PDF invoice template look like?
- **Automatic invoice sending** - When and how are invoices sent to customers?

### Order Management
- **Order creation workflow** - How are orders created from requests/quotes?
- **Payment processing** - Integration with payment gateways
- **Order fulfillment** - How does the fulfillment process work?
- **Shipping calculation** - How are shipping costs calculated?
- **Order status automation** - What triggers automatic status updates?

### Shipment Management
- **Carrier integration** - How does tracking number generation work?
- **Shipping label generation** - Integration with shipping providers
- **Delivery tracking** - How are delivery updates received and processed?
- **Return processing** - How are returns handled?

## 🟡 MEDIUM PRIORITY UNKNOWNS

### Authentication & Security
- **Password reset flow** - Email templates and reset logic
- **Email verification** - Verification email templates and flow
- **Session management** - Token refresh and expiration handling
- **Role-based access control** - Detailed permission matrix

### Data Relationships
- **Product-Order relationships** - How are order line items structured?
- **Customer data management** - How is customer information stored and updated?
- **Audit logging** - What actions are logged and how?

### Business Logic
- **Pricing rules** - Complex pricing logic based on customer type, volume, etc.
- **Inventory management** - Stock level tracking and low stock alerts
- **Reporting** - What reports are generated and how?

## 🟢 LOW PRIORITY UNKNOWNS

### UI/UX Details
- **Email templates** - Design and content of system emails
- **PDF generation** - Invoice and report PDF formatting
- **File upload limits** - Size and type restrictions for CSV imports
- **Data validation rules** - Specific validation requirements for each field

### Integration Details
- **External API rate limits** - How to handle API throttling
- **Error handling** - Specific error messages and user feedback
- **Caching strategy** - What data should be cached and for how long?

## 📝 IMPLEMENTATION NOTES

### What CAN be recreated from frontend:
- ✅ Complete UI layouts and component structures
- ✅ Form handling and validation (basic)
- ✅ State management patterns
- ✅ Navigation and routing
- ✅ Data display formatting
- ✅ Filter and search functionality (frontend only)
- ✅ Modal dialogs and user interactions
- ✅ Basic CRUD operations structure

### What NEEDS backend specification:
- ❌ Complex business logic
- ❌ External API integrations
- ❌ Payment processing workflows
- ❌ Email/notification systems
- ❌ File processing and validation
- ❌ Advanced reporting and analytics
- ❌ Automated workflows and triggers

---

**Last Updated:** Initial assessment
**Status:** Tracking unknowns as we rebuild functionality
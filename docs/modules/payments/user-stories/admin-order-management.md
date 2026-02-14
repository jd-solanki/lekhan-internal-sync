# User Story: Admin Order Management

## Story
**As an** administrator  
**I want** to view all orders and revenue  
**So that** I can monitor platform sales and customer purchases

**Module:** payments

## Acceptance Criteria
- [ ] Admin can access `/app/admin/orders` (role-protected route)
- [ ] Admin sees all orders from all customers
- [ ] Order list shows customer avatar, name, email
- [ ] Order list shows product name, amount, status, date
- [ ] Orders paginated for performance
- [ ] Admin can search and filter orders
- [ ] Regular users only see their own orders on billing page
- [ ] Order data synchronized from Polar
- [ ] Orders displayed in reverse chronological order

## How it Works
1. Admin navigates to `/app/admin/orders`
2. Admin middleware validates user.role === 'admin'
3. System fetches all orders via `/api/polar/orders` (admin scope)
4. Orders displayed with customer and product details
5. Admin can view order history and revenue metrics
6. Pagination loads additional orders as needed

## Alternate Flows
- **Filter by status**: Admin can filter paid, refunded, pending orders
- **Search by customer**: Admin can search by email or name
- **Export**: Future feature to export order data for reporting

## Edge Cases
- Large order volume requiring pagination optimization
- Orders with deleted customer accounts
- Orders for archived products
- Refunded orders display with negative amount or status indicator

## Notes
- Admin middleware enforces role-based access control
- Regular users' order API calls filtered to their user ID only
- Order data includes Polar order ID for reconciliation
- Customer information denormalized for display performance
- Revenue calculations may require aggregation logic
- Orders synced via webhooks to stay current with Polar

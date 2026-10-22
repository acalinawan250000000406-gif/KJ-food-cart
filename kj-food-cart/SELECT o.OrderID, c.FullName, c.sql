SELECT o.OrderID, c.FullName, c.PhoneNumber, o.EventName, o.EventDate,
       o.StartTime, o.EventAddress, o.Subtotal, o.Downpayment, o.BalanceDue
FROM dbo.Orders o
JOIN dbo.Customers c ON c.CustomerID = o.CustomerID
ORDER BY o.OrderID DESC;
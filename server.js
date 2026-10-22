// The frontend local host is http://localhost:5173/
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Windows Authentication via msnodesqlv8 (explicit ODBC connection string)
const dbConfig = {
    connectionString:
        'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-QEFRP98;Database=OnlineStore;Trusted_Connection=Yes;TrustServerCertificate=Yes;'
};

// Fallback downpayment if the site does not send one (customers pay this by QR)
const DOWNPAYMENT_AMOUNT = 500;
// Maximum number of paid party orders allowed on the same date
const MAX_ORDERS_PER_DATE = 3;

// ---------------------------------------------------------------
// Date availability: a date is "full" when it has 3 orders with a
// downpayment already paid (unpaid/abandoned orders don't block it)
// ---------------------------------------------------------------
app.get('/api/availability', async (req, res) => {
    try {
        const date = req.query.date;
        if (!date) return res.status(400).json({ full: false, error: 'date is required' });

        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('eventDate', sql.VarChar(10), date)
            .query(`
                SELECT COUNT(*) AS booked
                FROM dbo.Orders
                WHERE EventDate = CAST(@eventDate AS DATE) AND Downpayment > 0
            `);

        const booked = result.recordset[0].booked;
        res.status(200).json({ full: booked >= MAX_ORDERS_PER_DATE, booked });
    } catch (err) {
        console.error("Availability error:", err);
        res.status(500).json({ full: false, error: err.message });
    }
});

// ---------------------------------------------------------------
// Create order
// ---------------------------------------------------------------
app.post('/api/orders', async (req, res) => {
    console.log("--> Incoming Order Received:", req.body);

    const {
        customerName, phone, eventName, eventDate, eventTime, callTime,
        eventAddress, subtotal, instructions
    } = req.body;

    try {
        const pool = await sql.connect(dbConfig);

        // 1. Find the customer by phone number, or create them
        const name = customerName || 'Guest Customer';
        const phoneNumber = phone || '';

        const existing = await pool.request()
            .input('phone', sql.NVarChar(20), phoneNumber)
            .query(`SELECT TOP 1 CustomerID FROM dbo.Customers WHERE PhoneNumber = @phone`);

        let customerId;
        if (existing.recordset.length > 0) {
            customerId = existing.recordset[0].CustomerID;
        } else {
            const created = await pool.request()
                .input('fullName', sql.NVarChar(100), name)
                .input('phone', sql.NVarChar(20), phoneNumber)
                .query(`
                    INSERT INTO dbo.Customers (FullName, PhoneNumber)
                    OUTPUT INSERTED.CustomerID
                    VALUES (@fullName, @phone)
                `);
            customerId = created.recordset[0].CustomerID;
        }

        // 2. Generate OrderID (column is nvarchar(20), not auto-numbered)
        const orderId = 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);

        const sub = Number(subtotal) || 0;

        // 3. Insert the order (downpayment stays 0 until it is marked as paid)
        await pool.request()
            .input('orderId', sql.NVarChar(20), orderId)
            .input('customerId', sql.Int, customerId)
            .input('eventName', sql.NVarChar(150), eventName || '')
            .input('eventDate', sql.VarChar(10), eventDate || new Date().toISOString().slice(0, 10))
            .input('callTime', sql.NVarChar(10), callTime || eventTime || '')
            .input('startTime', sql.NVarChar(10), eventTime || '')
            // Venue / special instructions from the site are saved as the address
            .input('eventAddress', sql.NVarChar(sql.MAX), eventAddress || instructions || '')
            .input('subtotal', sql.Decimal(10, 2), sub)
            .input('downpayment', sql.Decimal(10, 2), 0)
            .input('balanceDue', sql.Decimal(10, 2), sub)
            .query(`
                INSERT INTO dbo.Orders
                    (OrderID, CustomerID, EventName, EventDate, CallTime, StartTime,
                     EventAddress, Subtotal, Downpayment, BalanceDue)
                VALUES
                    (@orderId, @customerId, @eventName, CAST(@eventDate AS DATE), @callTime, @startTime,
                     @eventAddress, @subtotal, @downpayment, @balanceDue)
            `);

        res.status(200).json({
            success: true,
            message: 'Order successfully inserted into SQL Server!',
            orderId: orderId,
            total: sub
        });
    } catch (err) {
        console.error("SQL Insertion Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ---------------------------------------------------------------
// Called by CartModal.jsx after the customer sends the downpayment
// ---------------------------------------------------------------
app.post('/api/orders/:id/paid', async (req, res) => {
    console.log(`--> Order ${req.params.id} marked as paid`);
    try {
        const down = Number(req.body.downpayment) || DOWNPAYMENT_AMOUNT;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('orderId', sql.NVarChar(20), req.params.id)
            .input('down', sql.Decimal(10, 2), down)
            .query(`
                UPDATE dbo.Orders
                SET Downpayment = CASE WHEN Subtotal < @down THEN Subtotal ELSE @down END,
                    BalanceDue  = CASE WHEN Subtotal > @down THEN Subtotal - @down ELSE 0 END
                WHERE OrderID = @orderId
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Paid update error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(5000, () => console.log('Backend Bridge Server running on port 5000!'));
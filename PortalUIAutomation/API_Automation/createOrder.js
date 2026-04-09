const axios = require('axios');

// 1. Your access token from the previous step
const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOTVTT3NDdkZUY3NlRmpqNTNiZy1lbFBsUlJZci00OEUzWmN0eDloZnVRIn0.eyJleHAiOjE3NzIxOTIzOTksImlhdCI6MTc3MjE5MjA5OSwianRpIjoiOWEzMDcwNjYtMTRjZC00MzAyLTg5ZDAtMjk0ZThiZTI3N2IwIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5zYW5kYm94Lm5nZW5pdXMtcGF5bWVudHMuY29tL2F1dGgvcmVhbG1zL25pIiwic3ViIjoiY2MzYTQ3OGUtNTY5Mi00NzIwLTk5NWYtOWRjZGE0ZGQ0ZjE2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiM2YyZWZlZTYtYzViNy00ODY2LThiYTYtMjIzNWYzY2RjMjBjIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJDUlAiLCJNUExPIiwiVlVXQyIsIlZTVUJQIiwiTVIiLCJWRFIiLCJNViIsIkZMUCIsIkNPIiwiTUVSQ0hBTlRfU1lTVEVNUyIsIlJBIiwiMDAwIiwiQVNDIiwiQ1YiLCJDT1NTIiwiVlBMTyIsIk1DIiwiTUZPIiwiVk8iLCJWUCIsIk1JIiwiVlQiLCJDU0FSIiwiQ0EiXX0sInNjb3BlIjoiIiwiY2xpZW50SG9zdCI6IjEwMC4xMTIuOC4xODIiLCJjbGllbnRJZCI6IjNmMmVmZWU2LWM1YjctNDg2Ni04YmE2LTIyMzVmM2NkYzIwYyIsImZvciI6InNlcnZpY2VBY2NvdW50IiwicmVhbG0iOiJuaSIsImdpdmVuX25hbWUiOiJNREVVQVQiLCJjbGllbnRBZGRyZXNzIjoiMTAwLjExMi44LjE4MiIsImhpZXJhcmNoeVJlZnMiOlsiYjkzZGRlNjMtYzU2Yi00NWEwLWJiNTctMmY5ODdhNmNhMGZjIl19.H1_0X_psl-hl97IeuXjxSP_a0ih4VUlxDUpS31czXfaRa5XglGn9clDzBhUqO22KeUpW7WAR-rK5hKvhtbVKVwJB4XUWeSFNt-b-BF1wOYOohVIuoiWwkzIGmamKDtLQDZHNkwMOrdokeGc2etXwCD8kqkkOhRYVYraH63SqGqenTwi_LIiAr2flrhhT9xXDMHjaVWPMorIexVqPwjCwpUkJNcyIPCB2CDujba8oU2BC1608PE7RQGIW4TvP05bvPP8tRRaMsKPzP8DFhgqIR9xDRIxKlHXpPZ8cqZAgdHSCgF1zYvSOaC6vCJAwNaDNKRTcXTuYDJTEBNBdxQ-NJw";

// 2. Define the API endpoint (update with your actual NI URL)
const url = "https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/30409911-a267-4013-98c0-f2c200899466/orders";

// 3. The request headers you specified
const headers = {
    'Content-Type': 'application/vnd.ni-payment.v2+json',
    'Authorization': `Bearer ${token}`
};

// 4. The order body
const orderData = {
    "action": "SALE",
    "amount": { "currencyCode": "AED", "value": 24000 },
    "emailAddress": "anonymous@xyz.com",
    "phoneNumber": { "countryCode": "+91", "subscriber": "1234567890" },
    "type": "SINGLE",
    "language": "en",
    "locale": "en-US",
    "merchantOrderReference": "order-123",
    "merchantAttributes": { "redirectUrl": "https://example.com/success" },
    "billingAddress": {
        "firstName": "John", "lastName": "Doe", "line1": "Street 1", "city": "Dubai", "country": "AE"
    },
    // ... remaining body parts as per your provided JSON
};

// 5. Execute the POST request
async function createOrder() {
    try {
        const response = await axios.post(url, orderData, { headers });
        console.log("Order Created Successfully:", response.data);
    } catch (error) {
        console.error("Error creating order:", error.response ? error.response.data : error.message);
    }
}

createOrder();

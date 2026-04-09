process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 1. CONFIGURATION
const OUTLET_ID = "30409911-a267-4013-98c0-f2c200899466";
const AUTH_BASIC = "M2YyZWZlZTYtYzViNy00ODY2LThiYTYtMjIzNWYzY2RjMjBjOmY2NDEzODIzLTA5MmYtNDE3Mi05NWRmLWVmNTI4MWEzNjJjMw==";

const IDENTITY_URL = "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token";

// FIXED: Added missing path /transactions/outlets/ and added $ for variable injection
const ORDER_URL = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${OUTLET_ID}/orders`;

async function runAutomation() {
    try {
        // --- STEP 1: GET ACCESS TOKEN ---
        console.log("Step 1: Fetching Access Token...");
        const authResponse = await fetch(IDENTITY_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${AUTH_BASIC}`,
                'Content-Type': 'application/vnd.ni-identity.v1+json',
                'Accept': 'application/vnd.ni-identity.v1+json'
            },
            body: JSON.stringify({ realmName: "ni" })
        });

        const authText = await authResponse.text();
        if (!authResponse.ok) {
            console.error(`Auth Error ${authResponse.status}:`, authText);
            return;
        }

        const authData = JSON.parse(authText);
        const token = authData.access_token;
        console.log("✓ Token obtained successfully.");

        // --- STEP 2: CREATE ORDER ---
        console.log("Step 2: Creating Order...");
        const orderData = {
            "action": "SALE",
            "amount": { "currencyCode": "AED", "value": 24000 },
            "emailAddress": "anonymous@xyz.com",
            "phoneNumber": { "countryCode": "+91", "subscriber": "1234567890" },
            "type": "SINGLE",
            "language": "en",
            "locale": "en-US",
            "merchantOrderReference": `Order-${Date.now()}`,
            "merchantAttributes": { "redirectUrl": "https://example.com/success" },
            "billingAddress": {
                "firstName": "John", "lastName": "Doe", "line1": "Street 1", "city": "Dubai", "country": "AE"
            }
        };

        const orderResponse = await fetch(ORDER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/vnd.ni-payment.v2+json',
                'Accept': 'application/vnd.ni-payment.v2+json'
            },
            body: JSON.stringify(orderData)
        });

        const orderText = await orderResponse.text();
        if (!orderResponse.ok) {
            console.error(`Order Error ${orderResponse.status}:`, orderText);
            return;
        }

        const orderResult = JSON.parse(orderText);

        // --- STEP 3: OUTPUT RESULT ---
        console.log("\n🚀 Success! Order Created.");
        console.log("Order Reference:", orderResult.reference);
        console.log("Payment URL:", orderResult._links.payment.href);

    } catch (error) {
        console.error("\n❌ Unexpected Error:", error.message);
    }
}

runAutomation();

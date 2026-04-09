
//const LIST_ORDERS_URL = `https://api-gateway.sandbox.ngenius-payments.com/unified-reporting/outlets/${OUTLET_ID}/orders`;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const OUTLET_ID = "30409911-a267-4013-98c0-f2c200899466";
const AUTH_BASIC = "M2YyZWZlZTYtYzViNy00ODY2LThiYTYtMjIzNWYzY2RjMjBjOmY2NDEzODIzLTA5MmYtNDE3Mi05NWRmLWVmNTI4MWEzNjJjMw==";

const IDENTITY_URL = "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token";

// CHANGE: This is the Unified Query endpoint for the "items" response
const QUERY_URL = `https://api-gateway.sandbox.ngenius-payments.com/unified-reporting/outlets/${OUTLET_ID}/orders`;

async function getOrders() {
    try {
        console.log("1. Fetching Token...");
        const authResponse = await fetch(IDENTITY_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${AUTH_BASIC}`,
                'Content-Type': 'application/vnd.ni-identity.v1+json'
            },
            body: JSON.stringify({ realmName: "ni" })
        });

        const { access_token } = await authResponse.json();
        console.log("✓ Token obtained.");
        console.log("2. Fetching Orders via Unified Query...");
        const response = await fetch(QUERY_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Accept': '*/*',
                'User-Agent': 'PostmanRuntime/7.35.0',
                'Connection': 'keep-alive'
            }
        });


        if (!response.ok) {
            const err = await response.text();
            console.error(`❌ Error ${response.status}:`, err);
            return;
        }

        const data = await response.json();

        // This will print the "items" array structure you provided
        // console.log(JSON.stringify(data, null, 4));
        //    const data = await response.json();

        if (data.items && data.items.length > 0) {
            console.log(`\nFound ${data.items.length} orders:`);
            console.log("--------------------------------------------------");

            data.items.forEach((order, index) => {
                const status = order.paymentStatus || "N/A";
                const ref = order.merchantOrderReference || "No Ref";
                const amount = (order.amount.value / 100).toFixed(2); // Convert fils to AED
                const time = new Date(order.timestamp).toLocaleString();

                console.log(`${index + 1}. [${status}] Ref: ${ref} | ${order.amount.currencyCode} ${amount} | ${time}`);
            });
            console.log("--------------------------------------------------");
        } else {
            console.log("No items found in the response.");
        }


    } catch (error) {
        console.error("\n❌ Script Error:", error.message);
    }
}

getOrders();

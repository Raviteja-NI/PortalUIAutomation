process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function getAccessToken() {
  const url = "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token";
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic M2YyZWZlZTYtYzViNy00ODY2LThiYTYtMjIzNWYzY2RjMjBjOmY2NDEzODIzLTA5MmYtNDE3Mi05NWRmLWVmNTI4MWEzNjJjMw==',
        'Content-Type': 'application/vnd.ni-identity.v1+json',
        'Accept': 'application/vnd.ni-identity.v1+json' // Added Accept header
      },
      body: JSON.stringify({ realmName: "ni" })
    });

    const text = await response.text(); // Read as text first to avoid the crash

    if (!response.ok) {
      console.error(`HTTP Error ${response.status}:`);
      console.log(text); // This will show the <html> error page content
      return;
    }

    const data = JSON.parse(text);
    console.log("Access Token:", data.access_token);
    return data.access_token;
    
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

getAccessToken();

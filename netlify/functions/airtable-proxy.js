const axios = require('axios');

exports.handler = async function(event, context) {
  // --- CORS Headers ---
  // These headers allow the browser to make requests from your Softr/Netlify domain.
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allows any domain. For better security, you could restrict this to your Netlify and Softr domains.
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS' // Allow GET for reading, PATCH for updating, and OPTIONS for pre-flight requests.
  };

  // --- Handle Pre-flight OPTIONS request ---
  // Browsers send this automatically before a PATCH request to check permissions.
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // "No Content" response, the browser knows it can proceed.
      headers: corsHeaders,
      body: ''
    };
  }

  // --- Airtable Configuration ---
  // Securely get credentials from Netlify environment variables.
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env;

  // Validate that credentials are set on the server.
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Server configuration error: Missing Airtable credentials on Netlify." })
    };
  }

  const API_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
  const API_HEADERS = {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    let response;

    // --- Handle GET request (Read data) ---
    if (event.httpMethod === 'GET') {
      response = await axios.get(API_ENDPOINT, { headers: API_HEADERS });
    }
    // --- Handle PATCH request (Update data) ---
    else if (event.httpMethod === 'PATCH') {
      // The data to update is in the body of the request from the browser.
      response = await axios.patch(API_ENDPOINT, event.body, { headers: API_HEADERS });
    }
    // --- Handle unsupported methods ---
    else {
      return {
        statusCode: 405, // Method Not Allowed
        headers: corsHeaders,
        body: JSON.stringify({ error: `HTTP method ${event.httpMethod} is not supported.` })
      };
    }

    // --- Success Response ---
    // Return the data from Airtable back to the browser.
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    // --- Error Handling ---
    console.error("Airtable API proxy error:", error);
    return {
      statusCode: error.response ? error.response.status : 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
export default async function checkAuth() {
  try {
    const res = await fetch("http://localhost:8080/check-auth", {
      method: "GET",
      credentials: "include", // This ensures cookies are included in the request
    });

    // Check if the response is successful
    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    return data; // Return the response data if successful
  } catch (err) {
    console.error("Error during authentication check:", err);
    return null; // Return null in case of an error
  }
}

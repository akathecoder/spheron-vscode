import axios from "axios";

export async function checkApiKey(apiKey: string) {
  const result = await axios
    .get("/api-keys/scope", {
      headers: {
        Authorization: "Bearer " + apiKey,
      },
    })
    .catch((error) => {
      if (error.response.status === 401) {
        return false;
      }
    });

  if (result === false || result === undefined) {
    return false;
  }

  return true;
}

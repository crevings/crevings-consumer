const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:42007/api";

export class ResponseError extends Error {
  response: Response;
  status: number;
  info: any;

  constructor(message: string, response: Response, info: any) {
    super(message);
    this.name = "ResponseError";
    this.response = response;
    this.status = response.status;
    this.info = info;
  }
}

export const fetcher = async (url: string) => {
  const absoluteUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  
  const res = await fetch(absoluteUrl, {
    headers: {
      "Content-Type": "application/json",
      // Add Authorization headers here if token is present
    },
  });

  if (!res.ok) {
    let info;
    try {
      info = await res.json();
    } catch {
      info = { message: "Failed to parse error response" };
    }
    throw new ResponseError(
      "An error occurred while fetching the data.",
      res,
      info
    );
  }

  return res.json();
};

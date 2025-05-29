import { GraphQLFormattedError } from "graphql";

// Define the Error type with proper statusCode type (string or number depending on use case)
type Error = {
  message: string;
  statusCode: string | number;
};

// Custom fetch function with proper Authorization header handling
const customFetch = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  const accessToken = localStorage.getItem("access_token");

  // Ensure headers is an object, handle cases where it might be undefined
  const headers = (options.headers || {}) as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization:
        headers.Authorization || (accessToken ? `Bearer ${accessToken}` : ""),
      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

// Fixed getGraphQLErrors function with proper typing and error handling
const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined> | null
): Error | null => {
  // Handle null or undefined body
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }

  // Check if errors exist in body
  if ("errors" in body && body.errors) {
    const errors = body.errors;

    // Map error messages and join them
    const messages = errors
      .map((error) => error?.message)
      .filter((msg): msg is string => !!msg)
      .join(", ");

    // Get the first error code, fallback to 500 if undefined
    const code = errors[0]?.extensions?.code || "500";

    return {
      message: messages || JSON.stringify(errors),
      statusCode: code,
    };
  }

  return null;
};

export const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);

  const responseClone = response.clone();
  const body = await responseClone.json();

  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};

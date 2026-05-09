import { isAxiosError } from "axios";

/**
 * Parses error from SDK/API calls and extracts a human-readable message
 * @param err - The error object (can be Axios error, Error instance, or unknown)
 * @param fallback - Fallback message if no message can be extracted
 * @returns A human-readable error message string
 *
 * @example
 * ```typescript
 * try {
 *   await sdk.api.someEndpoint.post({ ... })
 * } catch (error) {
 *   const message = parseSDKError(error, t('error.defaultMessage'))
 *   toast.add({
 *     severity: 'error',
 *     summary: t('error.title'),
 *     detail: message,
 *     life: 5000
 *   })
 * }
 * ```
 */
export function parseSDKError(
  err: unknown,
  fallback = "An unexpected error occurred",
): string {
  // Check if it's an Axios error with response data message
  if (isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }

  // Check if it's a standard Error instance
  if (err instanceof Error && err.message) {
    return err.message;
  }

  // Fallback for unknown error types
  return fallback;
}

---
name: backend-binding
description: Use this agent to bind backend SDK endpoints to frontend Vue/Nuxt components with proper state handling.
model: sonnet
color: purple
---

# Claude Code Agent: Backend Binding Expert

Use this agent when binding backend API SDK endpoints to frontend Vue/Nuxt components.

## SDK Import Pattern

```typescript
import { sdkMethod } from "@toarunokon/koyo-ai-lab-sdk";
```

## Fetch (useQuery) Pattern

```typescript
export function useMyData(id: Ref<string>) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;

  return useQuery<MyResponse>({
    queryKey: computed(() => ["my-data", id.value]),
    queryFn: async () => {
      const result = await sdkMethod({ baseUrl, path: { id: id.value } });
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}
```

## Mutation (useMutation) Pattern

```typescript
export function useMyMutation() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MyPayload) => {
      const result = await sdkMutationMethod({ baseUrl, body: payload });
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["related-queries"] });
    },
  });
}
```

## Error Parsing

Always use `parseSDKError` from `~/utils/error` for error messages:

```typescript
import { parseSDKError } from "~/utils/error";

toast.add({
  severity: "error",
  summary: "Failed to...",
  detail: parseSDKError(err, "Fallback message"),
  life: 5000,
});
```

The `parseSDKError` function handles:

- `err.response?.data?.message` - Axios error message
- `err.response?.data?.detail` - Axios error detail (common for "job already in progress" type errors)
- `err instanceof Error` - Standard error instances

## State Handling (CRITICAL)

Every component must handle:

- **Loading state**: Show skeleton shimmer UI via `isLoading` from useQuery
- **Error state**: Show error card with retry button, use `streamErrorStatus` and `streamErrorData` for typed error access
- **Empty state**: When data exists but is empty
- **Success state**: Normal display

## Toast Feedback for Mutations

```typescript
const toast = useToast();

function handleAction() {
  mutate(payload, {
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Action completed",
        detail: "Description of what happened",
        life: 5000,
      });
    },
    onError: (err) => {
      toast.add({
        severity: "error",
        summary: "Failed to perform action",
        detail: parseSDKError(err, "Unknown error"),
        life: 5000,
      });
    },
  });
}
```

## Composables Rule (CRITICAL)

**ALWAYS call composables at setup root level, NEVER inside functions or event handlers.**

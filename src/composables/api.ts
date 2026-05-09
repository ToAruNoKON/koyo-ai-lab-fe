import {
  readStreamsStreamsGet,
  readStreamStreamsStreamIdGet,
} from "@toarunokon/koyo-ai-lab-sdk";
import type {
  StreamResponse,
  DetailedStream,
} from "@toarunokon/koyo-ai-lab-sdk";
import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";

export function useStreams(
  sort: Ref<"newest" | "oldest">,
  search: Ref<string>,
) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;

  return useQuery<StreamResponse>({
    queryKey: computed(() => ["streams", sort.value, search.value]),
    queryFn: async () => {
      const result = await readStreamsStreamsGet({
        baseUrl,
        query: {
          sort: sort.value,
          search: search.value || undefined,
        },
      });
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function useStream(streamId: Ref<string>) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;

  return useQuery<DetailedStream>({
    queryKey: computed(() => ["stream", streamId.value]),
    queryFn: async () => {
      const result = await readStreamStreamsStreamIdGet({
        baseUrl,
        path: { stream_id: streamId.value },
      });
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

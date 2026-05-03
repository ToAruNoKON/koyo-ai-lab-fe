import { readStreamsStreamsGet } from "@toarunokon/koyo-ai-lab-sdk";
import type { StreamResponse } from "@toarunokon/koyo-ai-lab-sdk";
import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";

export function useStreams(sort: Ref<"newest" | "oldest">) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;

  return useQuery<StreamResponse>({
    queryKey: computed(() => ["streams", sort.value]),
    queryFn: async () => {
      const result = await readStreamsStreamsGet({
        baseUrl,
        query: { sort: sort.value },
      });
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}
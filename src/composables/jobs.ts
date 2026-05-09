import {
  readJobsJobsGet,
  cancelJobJobsJobIdCancelPost,
  readJobJobsJobIdGet,
  generateTranscriptionTranscriptionsGenerateStreamIdPost,
} from "@toarunokon/koyo-ai-lab-sdk";
import type {
  ListJobsResponse,
  JobResponse,
} from "@toarunokon/koyo-ai-lab-sdk";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

export function useActiveJobs() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;

  return useQuery<ListJobsResponse>({
    queryKey: ["jobs", "active"],
    queryFn: async () => {
      const result = await readJobsJobsGet({
        baseUrl,
        query: {
          status: "active",
        },
      });
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function useRecentJobs() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;

  return useQuery<ListJobsResponse>({
    queryKey: ["jobs", "recent"],
    queryFn: async () => {
      const result = await readJobsJobsGet({
        baseUrl,
        query: {
          limit: 5,
          sort: "newest",
        },
      });
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function formatEta(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function useCancelJob() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const result = await cancelJobJobsJobIdCancelPost({
        baseUrl,
        path: { job_id: jobId },
      });
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "active"] });
    },
  });
}

export function useJobDetail(jobId: Ref<string>) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;

  return useQuery<JobResponse>({
    queryKey: computed(() => ["job", jobId.value]),
    queryFn: async () => {
      const result = await readJobJobsJobIdGet({
        baseUrl,
        path: { job_id: jobId.value },
      });
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function useGenerateTranscription() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (streamId: string) => {
      const result =
        await generateTranscriptionTranscriptionsGenerateStreamIdPost({
          baseUrl,
          path: { stream_id: streamId },
        });
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
    },
  });
}

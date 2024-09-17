export const useCDN = () => ({
  radio: {
    getTrackCover: (radioId: string, internalId: string) => {
      return `${useRuntimeConfig().public.cdnUrl}/radio-${radioId}/${internalId}`;
    },
  },
});

export type CDN = ReturnType<typeof useCDN>;

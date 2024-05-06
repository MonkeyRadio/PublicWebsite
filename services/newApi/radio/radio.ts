import { Radio } from "./dto/Radio.dto";

const getByDomain = async () => {
  const apiURL = useRuntimeConfig().public.apiUrl;

  const radioData = await $fetch<Radio>(
    `${apiURL}/v4/radio/findByDomain?websiteDomain=${window.location.hostname}`,
  );
  return radioData;
};

export default {
  getByDomain,
};

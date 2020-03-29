import { useFetch } from "./useFetch";

interface Gift {
  id: string;
  description: string;
}

export const useGift = (authToken?: string, noRun?: boolean) => {
  const { data, err, loaded, forceReload } = useFetch<{ data: Gift[] }>(
    `${process.env.APP_ENDPOINT}/gift/ready`,
    {
      authToken,
      noRun: !authToken || noRun
    }
  );

  return {
    data: data?.data,
    err,
    loaded,
    forceReload
  };
};

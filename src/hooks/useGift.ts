import { useFetch, fetcher } from "./useFetch";

interface Gift {
  id: string;
  gift_type: {
    point: number;
  };
  description: string;
  user_id: string;
  created_at: number;
  status: "ready" | "opened";
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

export const tryOpenGift = (
  authToken: string,
  argument: {
    giftId: string;
  }
) => {
  return fetcher<void>(
    `${process.env.APP_ENDPOINT}/gift/${argument.giftId}/open`,
    {
      method: "POST",
      authToken
    }
  );
};

// admin用
export const tryDistributionGift = (
  authToken: string,
  argument: {
    point: number;
    description: string;
  }
) => {
  return fetcher<void>(
    `${process.env.APP_ENDPOINT}/admin/gift/distribute_all`,
    {
      method: "POST",
      body: JSON.stringify(argument),
      authToken
    }
  );
};

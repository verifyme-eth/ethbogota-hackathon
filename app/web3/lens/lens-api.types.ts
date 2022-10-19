export type FollowRequest = {
  request: {
    follow: [{ profile: string }];
  };
};

export type SignedAuthChallenge = {
  request: {
    address: string;
    signature: string;
  };
};

type FollowRequest = {
  request: {
    follow: [{ profile: string }];
  };
};

export default FollowRequest;

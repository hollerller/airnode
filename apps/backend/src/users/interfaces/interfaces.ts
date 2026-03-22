export interface UserCreated {
  id: number;
  name: string;
  lastName: string;
  email: string;
}

export interface TokenCreated {
  accessToken: string;
  refreshToken: string;
}

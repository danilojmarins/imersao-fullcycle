declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        name: string;
      };
    }
  }
}

export {};

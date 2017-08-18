declare module NodeJS  {
  interface Global {
    log: {
      debug: (any) => void,
      info: (any) => void,
      error: (any) => void,
    }
  }
}

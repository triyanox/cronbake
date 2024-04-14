const resolveIfPromise = async (value: any) =>
  value instanceof Promise ? await value : value;

const CBResolver = async (callback?: () => void) => {
  try {
    if (callback) {
      await resolveIfPromise(callback());
    }
  } catch (e) {}
};

export { resolveIfPromise, CBResolver };

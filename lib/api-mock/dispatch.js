function Dispatch() {
// v20201030
  const observers = [];

  const invokeObservers = (newState) => {
    observers.forEach((observer) => observer(newState));
  };

  return {

    subscribe: (observer) => {
      observers.push(observer);
      const unsubscribe = () => {
        const foundIdx = observers.some((x, idx) => {
          if (x === observer) {
            observers.splice(idx, 1);
            return true;
          }
          return false;
        });
      };
      return unsubscribe;
    },

    send: (message) => {
      invokeObservers(message);
    },
  };
}
 module.exports = Dispatch;

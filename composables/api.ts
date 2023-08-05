const apiURL = "https://api.monkeyradio.fr";

export const api = {
  ping: async () => {
    try {
      const c = await fetch(`${apiURL}/?ping`, {
        method: "GET",
      });
      if ((await c.text()) !== "pong") throw new Error("Can't ping API");
      return true;
    } catch (e) {
      throw new Error("Can't ping API");
    }
  },
};

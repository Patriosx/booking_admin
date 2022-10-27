// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  // payload= data
  // type = la función que queremos ejecutar
  const { payload, type } = action;
  switch (type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: payload,
      };
    case "LOGOUT":
      return { user: null, loading: false, error: null };
    default:
      return state;
  }
};

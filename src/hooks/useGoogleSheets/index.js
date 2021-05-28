import * as React from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";

const ActionTypes = {
  loading: "LOADING",
  error: "ERROR",
  success: "SUCCESS",
};

// const creds = require("./config/myapp-1dd646d7c2af.json"); // the file saved above
const SPREADSHEET_ID = "1BYNrWmBBQSjctUEzZp6sE07Nlge25WvLtMoLXiN2kOQ";
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

// or preferably, loading that info from env vars / config instead of the file
doc.useServiceAccountAuth({
  client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
});

const initialState = {
  loading: true,
  error: null,
  data: [],
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.loading:
      return { ...state, loading: action.payload };
    case ActionTypes.error:
      return { ...state, error: action.payload };
    case ActionTypes.success:
      return { ...state, data: action.payload };
    default:
      return state;
  }
}

// const useGoogleSheets = ({ apiKey, sheetIndex, sheetsNames = [] }) => {
const useGoogleSheets = ({ sheetIndex }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // const sheets = React.useRef(sheetsNames);

  const fetchData = React.useCallback(async () => {
    try {
      await doc.loadInfo();
      // console.log(doc.loadInfo());
      const sheet = await doc.sheetsByIndex[sheetIndex];
      const rows = await sheet.getRows();

      dispatch({
        type: ActionTypes.success,
        payload: rows,
      });
    } catch (error) {
      dispatch({ type: ActionTypes.error, payload: error });
    } finally {
      dispatch({ type: ActionTypes.loading, payload: false });
    }
  }, [sheetIndex]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
  };
};

export default useGoogleSheets;

import { createBrowserRouter } from "react-router-dom";
import OwnerManager from "../../components/OwnerManager";
import Safe from "../../components/Safe";
import Send from "../../components/Send";
import Transactions from "../../routes/Transactions";
import NewSafe from "../../routes/NewSafe";
import Root from "../../routes/Root";
import {
  DEPLOY_SAFE,
  SAFE_CREATE_TRANSACTION,
  SAFE_DETAILS,
  SAFE_SETTING,
  SAFE_TRANSACTIONS,
} from "./routes";
import HomeLogo from "../../components/HomeLogo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <HomeLogo /> },
      {
        path: `/${DEPLOY_SAFE}`,
        element: <NewSafe />,
      },
      {
        path: `/:safe/${SAFE_DETAILS}`,
        element: <Safe />,
      },
      {
        path: `/:safe/${SAFE_SETTING}`,
        element: <OwnerManager />,
      },
      {
        path: `/:safe/${SAFE_CREATE_TRANSACTION}`,
        element: <Send />,
      },
      {
        path: `/:safe/${SAFE_TRANSACTIONS}`,
        element: <Transactions />,
      },
    ],
  },
]);

export default router;

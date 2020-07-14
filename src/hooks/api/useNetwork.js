import * as sel from "src/selectors";
import { useSelector } from "src/redux";

export default function useNetwork() {
  const isTestnet = useSelector(sel.isTestNet);
  return { isTestnet };
}

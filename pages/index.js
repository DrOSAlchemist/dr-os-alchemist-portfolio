import PortfolioLanding from "@/components/PortfolioLanding";
import { getPublicRepositories } from "@/lib/github";

export async function getServerSideProps({ res }) {
  return { props: await getPublicRepositories(res) };
}

export default PortfolioLanding;
